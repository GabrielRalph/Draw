

class SvgDraw{
  constructor(element = 'none'){
    this.element = element;
    if (this.element === 'none'){
      console.error('No element assigned');
    }

    this.svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    this.element.appendChild(this.svg)
    this.h = 0
    this.w = 0
    this.paths = new SvgPaths()

    this.back = document.createElementNS("http://www.w3.org/2000/svg", 'path')
    this.foward = document.createElementNS("http://www.w3.org/2000/svg", 'path')
    this.createButtons = (sb) => {
      this.back.setAttribute('d',`M0,${sb}A${sb},${sb},0,0,0,${sb},0L0,0, Z`);
      this.back.setAttribute('fill','#DDDDDD');
      this.back.setAttribute('stroke','#DDDDDD');
      this.back.addEventListener('click', ()=>{
        this.svg.removeChild(this.paths.undo());
      })
      this.svg.appendChild(this.back)

      this.foward.setAttribute('d',`M${this.w},${sb}A${sb},${sb},0,0,1,${this.w - sb},0L${this.w},0, Z`);
      this.foward.setAttribute('fill','#DDDDDD');
      this.foward.setAttribute('stroke','#DDDDDD');
      this.foward.addEventListener('click', ()=>{
        this.svg.removeChild(this.paths.redo());
      })
      this.svg.appendChild(this.foward)
    }

    // Resize the svg and svg viewBox
    this.sizer = (e) => {
      this.w = e.currentTarget.innerWidth;
      this.h = e.currentTarget.innerHeight
      this.svg.style.setProperty('width', this.w)
      this.svg.style.setProperty('height', this.h)
      this.svg.setAttribute('viewBox',`0 0 ${this.w} ${this.h}`)
    }


    // Set up the window resize event listners depending on frame-size attribute
    this.setUpWindowSizer = () =>{
      var size = this.element.getAttribute('frame-size')
      console.log(size);
      switch (size){
        case 'fullscreen':
          window.addEventListener('resize', this.sizer)
          this.sizer({currentTarget: window})
        break;
        case 'element':
          this.element.addEventListener('resize', this.sizer)
          this.sizer({currentTarget: this.element})
      }
      this.createButtons(100)
    }
    this.setUpWindowSizer()


    this.setUpPenEvents = () => {
      this.element.addEventListener('touchstart', (e) => {this.svg.appendChild(this.paths.startNewPath(e.touches[0].clientX,e.touches[0].clientY))})
      this.element.addEventListener('touchmove', (e) => {this.paths.addCurrentPath(e.touches[0].clientX,e.touches[0].clientY)})
    }
    this.setUpPenEvents()

  }
  undo(){
    let to_remove = this.paths.undo();
    if(to_remove != null){
      this.svg.removeChild(to_remove)
    }
  }
  redo(){
    let to_add = this.paths.redo();
    if(to_add != null){
      this.svg.appendChild(to_add)
    }
  }
  setPenStyle(style){
    this.paths.setPenStyle(style)
  }
}

class SvgPaths{
  constructor(avg = 9){
    this.pathElements = [];
    this.history = []
    this.runSum = null;
    this.n = 0;
    this.maxn = avg;
    this.currentPath = null;
    this.pointsBuffer = [];
    this.penStyle = {
      stroke: 'white',
      'stroke-width': 6,
    }
  }

  setPenStyle(style){
    this.penStyle = style
  }

  startNewPath(x, y){
    console.log('start');
    this.currentPath = document.createElementNS("http://www.w3.org/2000/svg", 'path')
    this.pathElements.push(this.currentPath)
    this.history = [];

    let d = `M${x},${y}L${x},${y}`
    for (var key in this.penStyle){
      this.currentPath.setAttribute(key, this.penStyle[key])
    }
    this.currentPath.setAttribute("d", d)
    this.currentPath.setAttribute("fill", 'none')

    this.runSum = new Point(x,y)
    this.pointsBuffer = [new Point(x, y)]
    this.n = 1
    return this.currentPath
  }

  addCurrentPath(x, y){
    this.runSum.add(new Point(x, y))
    this.pointsBuffer.push(new Point(x, y))
    this.n++
    if (this.n > this.maxn){
      this.runSum.sub(this.pointsBuffer.shift())
      this.n--
    }

    let avg = this.runSum.assign()
    avg.div(new Point(this.n, this.n))
    var d = this.currentPath.getAttribute('d')
    d += `L${avg.x},${avg.y}`
    this.currentPath.setAttribute('d', d)
  }
  undo(){
    if(this.pathElements.length > 0){
      var undo_path = this.pathElements.pop()
      this.history.unshift(undo_path)
      return undo_path
    }else{
      return null
    }
  }
  redo(){
    if(this.history.length > 0){
      var redo_path = this.history.shift()
      this.pathElements.push(redo_path)
      return redo_path
    }else{
      return null
    }
  }
}

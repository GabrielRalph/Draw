

class SvgDraw{
  constructor(element = 'none'){
    this.element = element;
    if (this.element === 'none'){
      console.error('No element assigned');
    }
    this.background = 'rgb(10, 10, 10)'
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    this.svg.setAttribute('style',`background: ${this.background}`)
    this.element.appendChild(this.svg)
    this.h = 0
    this.w = 0
    this.paths = new SvgPaths()

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
    }
    this.setUpWindowSizer()


    this.setUpPenEvents = () => {
      this.element.addEventListener('touchstart', (e) => {
        if(e.target == this.svg){
          this.svg.appendChild(this.paths.startNewPath(e.touches[0].clientX,e.touches[0].clientY))
        }
      })
      this.element.addEventListener('touchmove', (e) => {
        this.paths.addCurrentPath(e.touches[0].clientX,e.touches[0].clientY)
      })
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

class SvgTools{
  constructor(svgdraw){
    this.svgdraw = svgdraw


    this.mainPannel = document.createElement("DIV")
    this.mainStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      width: 'calc(100% - 2*10px)',
      height: '50px',
      padding: '10px',
      'z-index': '3'
    }
    this.mainPannel.setAttribute('style', jsonToStyle(this.mainStyle))
    this.svgdraw.element.appendChild(this.mainPannel)
    this.buttonStyle = {
      width: '44px',
      height: '44px',
      border: '3px solid rgba(255, 255, 255, 0.5)',
      'border-radius': '50px',
      display: 'inline-block',
    }
    this.color = document.createElement("DIV")
    this.back = document.createElement("DIV")
    this.forward = document.createElement("DIV")

    this.back.setAttribute('style', jsonToStyle(this.buttonStyle) + '; float: left');
    this.forward.setAttribute('style', jsonToStyle(this.buttonStyle) + '; float: right');
    this.color.setAttribute('style', jsonToStyle(this.buttonStyle) + `; position: absolute; left: calc(50% - 25px); background: ${this.svgdraw.paths.penStyle.stroke}`);

    this.colorPickerElement = document.createElement("DIV")
    this.pickerStyle = {
      margin: '25px',
      position: 'absolute',
      top: '1000%',
      left: 0,
      right: 0,
      transition: '0.4s ease-in'
    }
    this.pickerShown = false
    this.colorPickerElement.setAttribute('style', jsonToStyle(this.pickerStyle))
    this.mainPannel.appendChild(this.colorPickerElement)
    this.colorPicker = new iro.ColorPicker(this.colorPickerElement, {
      color: '#f6ff00',
      padding: 0,
      sliderSize: 35,
      borderWidth: 3,
      handleRadius: 10,
      width: this.colorPickerElement.clientWidth,
      margin: 30,
      layout: [
        {
          component: iro.ui.Wheel,
          options: {
            wheelAngle: 45,
            borderColor: '#ffffff',
          }
        },
        {
          component: iro.ui.Slider,
          options: {
            sliderType: 'saturation' // can also be 'saturation', 'value', 'alpha' or 'kelvin'
          }
        },
        {
          component: iro.ui.Slider,
          options: {
            sliderType: 'value' // can also be 'saturation', 'value', 'alpha' or 'kelvin'
          }
        },
      ]
    })
    this.colorPicker.on('color:change', (color) => {
      // if the first color changed
      if (color.index === 0) {
        this.color.style.setProperty('background', color.hexString)
        this.svgdraw.paths.penStyle.stroke = color.hexString
      }
    });
    document.addEventListener('keydown', function(event) {
      if (event.ctrlKey && event.key === 'z') {
        this.svgdraw.undo();
      }else if (event.ctrlKey && event.key === 'y'){
        this.svgdraw.redo();
      }
    });
    this.back.addEventListener('touchstart', () => {
      this.svgdraw.undo()
    })
    this.forward.addEventListener('click', () => {
      this.svgdraw.redo()
    })
    this.color.addEventListener('click', () => {
      this.pickerShown = !this.pickerShown
      if(this.pickerShown){
        this.colorPickerElement.style.setProperty('top', '50px')
      }else{
        this.colorPickerElement.style.setProperty('top', '1000%')
      }
    })

    this.mainPannel.appendChild(this.back)
    this.mainPannel.appendChild(this.forward)
    this.mainPannel.appendChild(this.color)
  }
  setLandscape(){
    this.mainStyle.width = '100px'
    this.mainStyle.height = '100%'
    this.mainPannel.setAttribute('style', jsonToStyle(this.mainStyle))

  }
  setPortrait(){
    this.mainStyle.width = '100%'
    this.mainStyle.height = '100px'
    this.mainPannel.setAttribute('style', jsonToStyle(this.mainStyle))
  }
  setPenColor(){

  }
}
let jsonToStyle = (styles) => {
  style_string = ""
  for (style in styles){
    style_string += `${style}: ${styles[style]};`
  }
  return style_string.substring(0, style_string.length-1)
}
let setStyle = (styles) => {
  return setAttribute('style', jsonToStyle(styles))
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

    this.currentPath.setAttribute('style', jsonToStyle(this.penStyle) + ';stroke-linejoin: round; stroke-linecap: round')
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

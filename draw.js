

class SvgDraw{
  constructor(svg = 'none'){
    this.svg = svg;
    console.log(svg);
    if (this.svg === 'none'){
      console.error('No element assigned');
    }
    this.drawSpace = this.svg.getElementById('draw-space');
    this.drawSpace.setAttribute('style','stroke-linejoin: round; stroke-linecap: round');
    this.viewBox = this.svg.getAttribute('viewBox')
    this.drawSpace.setAttribute('viewBox',this.viewBox)
    // this.h = 0
    // this.w = 0
    this.paths = new SvgPaths(5)
    this.landscape = false

    // Resize the svg and svg viewBox
    // this.callback = null
    // this.sizer = (e) => {
    //   this.w = e.currentTarget.innerWidth
    //   this.h = e.currentTarget.innerHeight
    //   this.svg.style.setProperty('width', this.w)
    //   this.svg.style.setProperty('height', this.h)
    //   this.svg.setAttribute('viewBox',`0 0 ${this.w} ${this.h}`)
    //   this.landscape = (this.w > this.h)
    //   if(this.callback != null){
    //     this.callback({w:this.w, h:this.h, landscape: this.landscape})
    //   }
    // }
    this.elementStyle = () => {
      return{
        overflow: 'hidden'
      }
    }
    // Set up the window resize event listners depending on frame-size attribute
    // this.setUpWindowSizer = () =>{
    //   var size = this.element.getAttribute('frame-size')
    //   console.log(size);
    //   switch (size){
    //     case 'fullscreen':
    //       window.addEventListener('resize', this.sizer)
    //       // window.addEventListener("orientationchange", this.sizer);
    //       this.element.setAttribute('style',jsonToStyle(this.elementStyle()))
    //       this.sizer({currentTarget: window})
    //     break;
    //     case 'element':
    //       this.element.addEventListener('resize', this.sizer)
    //       this.sizer({currentTarget: this.element})
    //   }
    // }
    // this.setUpWindowSizer()


    this.setUpPenEvents = () => {
      this.svg.addEventListener('touchend', (e) => {
          e.preventDefault();
      })
      this.svg.addEventListener('touchstart', (e) => {
        e.preventDefault();
        let is = !showPicker;
        is &= e.touches[0].target.classList[0] != 'click-box'
        if(is){
          this.drawSpace.appendChild(this.paths.startNewPath(e.touches[0].clientX,e.touches[0].clientY))
        }else{
        }
      })
      this.svg.addEventListener('touchmove', (e) => {
        e.preventDefault();
        let is = !showPicker
        is &= e.touches[0].target.classList[0] != 'click-box'
        if(is){
          this.paths.addCurrentPath(e.touches[0].clientX,e.touches[0].clientY)
        }
      })
    }
    this.setUpPenEvents()

  }
  sizeUpdate(callback){
    this.callback = callback
    this.callback({w:this.w, h:this.h, landscape: this.landscape})
  }
  undo(){
    let to_remove = this.paths.undo();
    if(to_remove != null){
      this.drawSpace.removeChild(to_remove)
    }
  }
  redo(){
    let to_add = this.paths.redo();
    if(to_add != null){
      this.drawSpace.appendChild(to_add)
    }
  }
  setPenStyle(style){
    this.paths.setPenStyle(style)
  }
  clear(){
    this.paths.clear()
    this.drawSpace.innerHTML = ''
  }
}
let showPicker = false
class SvgTools{
  constructor(svgdraw){
    //An svgDraw object
    this.svgdraw = svgdraw

    // // --------------- BUTTON SETUP ----------------//
    // // --------- MAIN PANNEL SETUP----------------//
    this.mainPannel = document.createElement("DIV")
    this.svgdraw.svg.parentNode.appendChild(this.mainPannel)




    //------------------------COLOR PICKER----------------------//
    this.colorPickerElement = document.createElement("DIV")
    this.pickerStyle = {
      margin: '25px',
      position: 'absolute',
      top: '1000%',
      'z-index': '100',
      // background: 'rgb(255,250,245)',
      left: 0,
      right: 0,
      transition: '0.5s ease-in'
    }
    this.pickerShown = false
    this.colorPickerElement.setAttribute('style', jsonToStyle(this.pickerStyle))
    this.mainPannel.appendChild(this.colorPickerElement)
    this.colorPicker = new iro.ColorPicker(this.colorPickerElement, {
      color: 'hsl(338, 100%, 64%)',
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



    //---------------------BUTTON SETUP------------------------//
    // this.btnSize = '50px';
    // this.margin = '20px'
    // this.buttonStyles = (landscape) => {
    //   return{
    //     baseStyle:{
    //       width: `calc(${this.btnSize}* 0.88)`,
    //       height: `calc(${this.btnSize}* 0.88)`,
    //       border: `calc(${this.btnSize} * 0.06) solid rgba(255, 255, 255, 0.5)`,
    //       'border-radius': `calc(${this.btnSize} * 0.6)`,
    //       display: 'inline-block',
    //       position: 'fixed',
    //       transition: '0.3s ease-in'
    //     },
    //     undo: {
    //       top: this.margin,
    //       left: this.margin
    //     },
    //     redo: {
    //       top : landscape?  `calc(100% - ${this.btnSize} - ${this.margin})` : this.margin,
    //       left: landscape?  this.margin                                     : `calc(100% - ${this.btnSize} - ${this.margin})`,
    //     },
    //     color: {
    //       top : landscape ?  `calc(50% - ${this.btnSize} / 2)`  : this.margin,
    //       left: landscape ?  this.margin                        : `calc(50% - ${this.btnSize} / 2)`,
    //     },
    //     save: {
    //       bottom: this.margin,
    //       right: this.margin
    //     }
    //   }
    // }

    this.pen = document.getElementById("pen")
    this.undo = document.getElementById("undo")
    this.redo = document.getElementById("redo")
    this.send = document.getElementById("send")
    // this.labelStyle = () => {
    //   return{
    //     'line-height': `calc(${this.btnSize}* 0.88)`,
    //     'text-align': 'center',
    //     'color': 'rgba(255, 255, 255, 0.5)',
    //     width: '100%'
    //   }
    // }
    // this.label_redo = document.createElement("div")
    // this.redo.appendChild(this.label_redo)
    // this.label_redo.innerHTML = 'R'
    //
    // this.label_undo = document.createElement("div")
    // this.undo.appendChild(this.label_undo)
    // this.label_undo.innerHTML = 'U'
    //
    // this.label_save = document.createElement("div")
    // this.save.appendChild(this.label_save)
    // this.label_save.innerHTML = 's'

    this.save_callback = null

    // this.updateButtons = (dim) => {
    //   this.colorPicker.layoutDirection = dim.landscape?"horizontal":"vertical"
    //   this.label_undo.setAttribute('style',jsonToStyle(this.labelStyle()))
    //   this.label_redo.setAttribute('style',jsonToStyle(this.labelStyle()))
    //   this.label_save.setAttribute('style',jsonToStyle(this.labelStyle()))
    //   let styles = this.buttonStyles(dim.landscape)
    //   for (style in styles){
    //     if(style != "baseStyle"){
    //       this[style].setAttribute('style', jsonToStyle(Object.assign(styles[style], styles.baseStyle)))
    //     }
    //   }
    //   this.color.style.setProperty('background', this.svgdraw.paths.penStyle.stroke)
    // }
    // this.mainPannel.appendChild(this.undo)
    // this.mainPannel.appendChild(this.redo)
    // this.mainPannel.appendChild(this.color)
    // this.mainPannel.appendChild(this.save)






    // ----------------------- Callback SETUP ----------------------------//
    this.colorPicker.on('color:change', (color) => {
      // if the first color changed
      if (color.index === 0) {
        this.svgdraw.svg.style.setProperty('--pen-h', color.hsl.h)
        this.svgdraw.svg.style.setProperty('--pen-s', color.hsl.s+'%')
        this.svgdraw.svg.style.setProperty('--pen-l', color.hsl.l+'%')
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

    this.undo.addEventListener('touchstart', () => {
      this.svgdraw.undo()
    })
    this.redo.addEventListener('touchstart', () => {
      this.svgdraw.redo()
    })
    this.send.addEventListener('touchstart', () => {
      if(this.save_callback != null){
        console.log(this.svgdraw.drawSpace);
        this.save_callback(this.svgdraw.drawSpace)
      }
      this.svgdraw.clear()
    })

    var debug_delay = true
    this.pen.addEventListener('touchstart', () => {

      if (debug_delay){
        debug_delay = false;
        setTimeout(() => {debug_delay = true}, 600)
        this.pickerShown = !this.pickerShown
        showPicker = !showPicker
        if(this.pickerShown){
          this.colorPickerElement.style.setProperty('top', '50px')
        }else{
          this.colorPickerElement.style.setProperty('top', '1000%')
        }

      }
    })
    // this.svgdraw.sizeUpdate((e) => {
    //   this.updateButtons(e)
    // })
  }
  onSave(callback){
    this.save_callback = callback
  }
}
let jsonToStyle = (styles) => {
  style_string = ""
  for (style in styles){
    value = styles[style]
    if (value != null){
      style_string += `${style}: ${value};`
    }
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
      'stroke-width': '4',
    }
    this.r2d = (x) => {return Math.round(x*100)/100}
  }

  setPenStyle(style){
    this.penStyle = style
  }

  startNewPath(x, y){
    console.log('start');
    this.currentPath = document.createElementNS("http://www.w3.org/2000/svg", 'path')
    this.pathElements.push(this.currentPath)
    this.history = [];

    this.currentPath.setAttribute('stroke', this.penStyle.stroke)
    this.currentPath.setAttribute('stroke-width', '7')
    let d = `M${this.r2d(x)},${this.r2d(y)}L${this.r2d(x)},${this.r2d(y)}`

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
    d += `L${this.r2d(avg.x)},${this.r2d(avg.y)}`
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
  clear(){
    this.pathElements = [];
    this.history = []
  }
}

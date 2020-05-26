
class DrawBrailSVG{
  constructor(element, options){
    this.createSvgObject = (name) => {
      return document.createElementNS("http://www.w3.org/2000/svg", name);
    }
    this.letterSpacing = 5
    this.dotSpacing = 3
    this.dotRadius = 0.8
    this.lineSpacing = 5
    this.letterSpacing_pattern = this.dotSpacing + this.letterSpacing
    this.lineSpacing_pattern = this.dotSpacing*2 + this.lineSpacing
    this.rows = 4
    this.columns = 20
    this.margin = 10
    this.ss = 'stroke: black; fill: none; stroke-width: 0.1'
    Object.assign(this, options)
    this.width = (this.columns - 1)*this.letterSpacing_pattern + this.dotSpacing + 2*this.margin
    this.height = (this.rows - 1)*this.lineSpacing_pattern + 2*this.dotSpacing + 2*this.margin
    this.svg = this.createSvgObject('svg')
    this.svg.setAttribute('viewBox', `-${this.margin} -${this.margin} ${this.width} ${this.height}`)
    element.appendChild(this.svg)
    this.add = (elem) => {
      this.svg.appendChild(elem)
    }
  }

  drawSVG(options){
    this.svg.innerHTML = ''
    console.log(this);
    Object.assign(this, options)
    let lw = this.dotSpacing
    let lh = 2 * this.dotSpacing

    let lesp = this.letterSpacing + lw;
    let lisp = this.lineSpacing + lh;

    this.width = (this.columns - 1)*lesp + lw + 2*this.margin
    this.height = (this.rows - 1)*lisp + lh + 2*this.margin
    this.svg.setAttribute('viewBox', `-${this.margin} -${this.margin} ${this.width} ${this.height}`)

    let w = this.width - 1.5*this.margin
    let h = this.height - 1.5*this.margin
    let m = this.margin/2
    let outline = this.createSvgObject('path')
    outline.setAttribute('d',`M ${-m},${-m} L${w},${-m}L${w},${h}L${-m},${h}Z`)
    outline.setAttribute('style', this.ss)
    this.add(outline)

    for(var r = 0; r < this.rows; r++){
      for(var c = 0; c < this.columns; c++){
        this.drawLetter(c*lesp, r*lisp)
      }
    }

  }

  drawLetter(x, y){
    let ds = this.dotSpacing;
    for(var x1 = x; x1 < x+2*ds; x1 += ds){
      for(var y1 = y; y1 < y+3*ds; y1 += ds){
        let circle = this.createSvgObject('ellipse')
        circle.setAttribute('cx', x1)
        circle.setAttribute('cy', y1)
        circle.setAttribute('ry', this.dotRadius)
        circle.setAttribute('rx', this.dotRadius)
        circle.setAttribute('style', this.ss)
        this.add(circle)
      }
    }
  }

  download(){
    this.svg.setAttribute('width',`${this.width}mm`)
    this.svg.setAttribute('height',`${this.height}mm`)
    var text = this.svg.outerHTML
    var text = `${text.split('><')[0]}>${this.svg.innerHTML}</svg>`
    var blob = new Blob([text], {type: "text/plain"});
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = 'brail_stencil.svg';
    a.click();
  }
}
let ferransBrail = new DrawBrailSVG(document.getElementsByTagName('brail-svg')[0], {margin: 10})
ferransBrail.drawSVG()

var inputs = document.getElementsByTagName('input')
for(var i = 0; i < inputs.length; i++){
  inputs[i].value = ferransBrail[inputs[i].id]
  inputs[i].addEventListener('input', (e) => {
    if(e.target.value != 0){
      ferransBrail[e.target.id] = parseFloat(e.target.value)
      ferransBrail.drawSVG()
    }
  })
}
var download = document.getElementById('download')
download.addEventListener('click', ()=>{
  ferransBrail.download()
})

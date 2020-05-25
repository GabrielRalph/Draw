
let mydrawpad = new SvgDraw(document.getElementsByTagName("draw")[0])
mydrawpad.setPenStyle({
  stroke: '#f6ff00',
  'stroke-width': mydrawpad.w/50
})
document.addEventListener('keydown', function(event) {
  if (event.ctrlKey && event.key === 'z') {
    mydrawpad.undo();
  }else if (event.ctrlKey && event.key === 'y'){
    mydrawpad.redo();
  }
});

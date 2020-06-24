// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDZN3RXo6hsm9b28AaSoFKAnlFyYs4quz4",
  authDomain: "svgdrawpad.firebaseapp.com",
  databaseURL: "https://svgdrawpad.firebaseio.com",
  projectId: "svgdrawpad",
  storageBucket: "svgdrawpad.appspot.com",
  messagingSenderId: "399249408634",
  appId: "1:399249408634:web:077e81e3cdbf1b47d0b1c3"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// var data = firebase.database();
// console.log(data);

function created(svg){
  let x = svg.clientWidth
  let y = svg.clientHeight
  console.log(x, y);
  svg.setAttribute('viewBox',`0 0 ${x} ${y}`)
}

window.onload = () => {
  let svg = document.getElementById('container')
  svg.onload = created(svg)

  let mydrawpad = new SvgDraw(document.getElementById('container'))
  mydrawpad.setPenStyle({
    stroke: 'hsl(338, 100%, 64%)',
    'stroke-width': mydrawpad.w/50
  })
  document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'z') {
      mydrawpad.undo();
    }else if (event.ctrlKey && event.key === 'y'){
      mydrawpad.redo();
    }
  });
  let mytools = new SvgTools(mydrawpad)
  mytools.onSave((e) => {
    let date = new Date();
    var text = `${e.outerHTML.split('><')[0]}>${e.innerHTML}</svg>`
    text = text.replace(/"/g, "'")
    firebase.database().ref(`svgs/${date}`).set(text)
  })
}

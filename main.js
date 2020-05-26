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
let mytools = new SvgTools(mydrawpad)
mytools.onSave((e) => {
  let date = new Date();
  var text = `${e.outerHTML.split('><')[0]}>${e.innerHTML}</svg>`
  text = text.replace(/"/g, "'")
  firebase.database().ref(`svgs/${date}`).set(text)
})

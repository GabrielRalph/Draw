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
var main = document.getElementsByTagName('draw')[0]
firebase.database().ref('/svgs/').on("child_added", (sc) => {
  let elem = document.createElement('DIV')
  elem.innerHTML = sc.val()
  elem.clicked_times = 0;
  elem.firebase_key = sc.key
  elem.addEventListener('click', () => {
    elem.clicked_times++;
    if(elem.clicked_times > 3){
      main.removeChild(elem)
      firebase.database().ref(`/svgs/${elem.firebase_key}`).remove()
    }else{
      console.log(`${3 - elem.clicked_times} times before deletion`);
    }
  })
  main.appendChild(elem)
  elem.scrollIntoView({block: "center"});

})

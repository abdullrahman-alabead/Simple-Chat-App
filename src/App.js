import './App.scss';
import Header from './components/Header'
import SignIn from './components/SignIn'
import ChatScreen from './components/ChatScreen';
import { app, auth, database, } from './firebaseConfig'
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth'
import { collection, addDoc } from 'firebase/firestore'
import React from 'react';


function App() {
  let [isLoggedIn, setIsLoggedIn] = React.useState(false)
  React.useEffect(() => {
    onAuthStateChanged(auth, user => {if(user){setIsLoggedIn(true)}})
  }, [])


  //sign in using google:
  let googleProvier = new GoogleAuthProvider();
  function signInWithGoogle() {
    signInWithPopup(auth, googleProvier)
    .then(response => alert("Signed In Succesfully!"))
    .catch(err => console.log(err.message))
  }

  // Sign out 
  function signOut() {
    auth.signOut().then(data => {alert("Signed-Out Succefully"); })
  }

  // Dark/Light mode
  let [darkMode, setDarkMode] = React.useState(true)
  return (
    <div className={`app ${darkMode? 'dark': 'light'}`}>
      <Header isLoggedIn={isLoggedIn} darkMode={darkMode} toggleDark={() => setDarkMode(prev => !prev)} signOut={() => {signOut(); setIsLoggedIn(false)}} />
      {isLoggedIn ? <ChatScreen darkMode={darkMode}/> :<SignIn signIn={signInWithGoogle} darkMode={darkMode} />}
    </div>
  );
}

export default App;

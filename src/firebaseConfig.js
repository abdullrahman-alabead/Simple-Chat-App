import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'


const firebaseConfig = {
  apiKey: "AIzaSyAMWGWx6kKeUc_zDl73WJm_Sw6AJyZlmgo",
  authDomain: "nolans-chat-app.firebaseapp.com",
  projectId: "nolans-chat-app",
  storageBucket: "nolans-chat-app.appspot.com",
  messagingSenderId: "95090990902",
  appId: "1:95090990902:web:5050cdbab6001946009d97"
};






export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const database = getFirestore(app)
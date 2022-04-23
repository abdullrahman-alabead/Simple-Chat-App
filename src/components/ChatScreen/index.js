import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Message from "../Message";
import "./index.scss";
import { database, auth } from "../../firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { clear } from "@testing-library/user-event/dist/clear";

export default function ChatScreen(props) {
  // keep track of the message input field
  let [message, setMessage] = React.useState({});

  function handleInput(e) {
    setMessage({ message: e.target.value });
    checkIfTyping();
  }

  // send message to firestore
  let collectionRef = collection(database, "messages");
  let user = auth.currentUser;

  function sendMessage(e) {
    e.preventDefault();

    // Check if the message is empty
    if (document.querySelector(".text-msg").value == "") {
      alert("Enter A message First");
      return;
    }

    let date = new Date();
    let hour = `${date.getHours() % 12}`.padStart(2, "0");
    let minuts = `${date.getMinutes()}`.padStart(2, "0");

    document.querySelector(".text-msg").value = "";
    addDoc(collectionRef, {
      message: message.message,
      sentTime: `${hour}:${minuts}`,
      name: user.displayName,
      photo: user.photoURL,
      _orderTime: Date.now(),
      uid: user.uid,
    })
      .then(() => {
        var messageBody = document.querySelector(".messages");
        messageBody.scrollTop =
          messageBody.scrollHeight - messageBody.clientHeight;
      })
      .catch((err) => alert(err.message));
  }

  // get messages from firestore

  let [msgEle, setMsgEle] = React.useState("");
  function getMessages() {
    // order by time
    let q = query(collectionRef, orderBy("_orderTime"));

    onSnapshot(q, (data) => {
      setMsgEle(
        data.docs);
    });
  }
  React.useEffect(getMessages, []);

  // Check if typing
  let [isTyping, setIsTyping] = React.useState();

  let timer = React.useRef(false);

  function checkIfTyping() {
    let docRef = doc(database, "messages", "IsTyping");

    updateDoc(docRef, { TypingState: true });

    if (!timer.current) {
      timer.current = true;
      setTimeout(() => {
        updateDoc(docRef, { TypingState: false });
        timer.current = false;
      }, 2000);
    } else {
    }
  }

  let docRef = doc(database, "messages", "IsTyping");
  onSnapshot(docRef, (data) => setIsTyping(data.data().TypingState));
  return (
    <div className={`chat-screen ${props.darkMode? 'dark' : 'true'}`}>
      <p
        className="isTyping"
        style={isTyping ? { display: "block" } : { display: "none" }}
      >
        Someone Is Typing...
      </p>
      <ul className="messages">{msgEle ? msgEle.map((doc) => {
          return (
            <Message
              class={doc.data().uid == user.uid ? "sent" : "received"}
              message={doc.data().message}
              name={doc.data().name}
              time={doc.data().sentTime}
              photo={doc.data().photo}
              darkMode={props.darkMode}
            />
          );
        }) : ""}</ul>
      <form className="send-message">
        <input
          type="text"
          name="message"
          className="text-msg"
          placeholder="Message..."
          onChange={handleInput}
        />
        <button className="send-btn" onClick={sendMessage}>
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </form>
    </div>
  );
}

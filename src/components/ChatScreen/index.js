import { faPaperclip, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Message from "../Message";
import FileMessage from "../FileMessage";
import "./index.scss";
import { database, auth, storage } from "../../firebaseConfig";
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
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { nanoid } from "nanoid";

export default function ChatScreen(props) {
  // keep track of the message input field
  let [message, setMessage] = React.useState({});

  function handleInput(e) {
    setMessage({ message: e.target.value });
    checkIfTyping();
  }

  // sending Files Handling
  let [file, setFile] = React.useState("");

  let fileBtn = document.querySelector(".send-file");
  let fileInput = document.querySelector(".file-input");

  let uploadFile = (e) => {
    e.preventDefault();
    fileInput.click();
  };

  function updateFile(e) {
    e.preventDefault();
    setFile(e.target.files[0]);
  }

  // send message/file to firestore
  let collectionRef = collection(database, "messages");
  let user = auth.currentUser;

  function sendMessage(e) {
    e.preventDefault();
    // file upload
    if (file) {
      let fileRef = ref(storage, file.name);
      let uploadTask = uploadBytesResumable(fileRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (err) => alert(err.message),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            addDoc(collectionRef, {
              type:'file',
              fileUrl: url,
              fileName: file.name,
              uid: user.uid,
              photo: user.photoURL,
              _orderTime: Date.now(),
            });
          });
        }
      );
      setFile(null);
    }

    // Check if the message is empty
    if (document.querySelector(".text-msg").value == "" && !file) {
      alert("Nothing to send");
      return;
    }
    // Send Message
    if (document.querySelector(".text-msg").value != "") {
      let date = new Date();
      let hour = `${date.getHours() % 12}`.padStart(2, "0");
      let minuts = `${date.getMinutes()}`.padStart(2, "0");

      document.querySelector(".text-msg").value = "";
      addDoc(collectionRef, {
        type: "text",
        message: message.message,
        sentTime: `${hour}:${minuts}`,
        name: user.displayName,
        photo: user.photoURL,
        _orderTime: Date.now(),
        uid: user.uid,
        id: nanoid()
      })
        .then(() => {
          var messageBody = document.querySelector(".messages");
          messageBody.scrollTop =
            messageBody.scrollHeight - messageBody.clientHeight;
        })
        .catch((err) => alert(err.message));
    }
  }

  // get messages/files from firestore

  let [msgEle, setMsgEle] = React.useState("");
  function getMessages() {
    // order by time
    let q = query(collectionRef, orderBy("_orderTime"));

    onSnapshot(q, (data) => {
      setMsgEle(data.docs);
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
    <div className={`chat-screen ${props.darkMode ? "dark" : "true"}`}>
      <p
        className="isTyping"
        style={isTyping ? { display: "block" } : { display: "none" }}
      >
        Someone Is Typing...
      </p>
      <ul className="messages">
        {msgEle
          && msgEle.map((doc) => {
              let data = doc.data();
              if (data.type == "text")
              {
              return (

                <Message
                  class={data.uid == user.uid ? "sent" : "received"}
                  message={data.message}
                  name={data.name}
                  time={data.sentTime}
                  photo={data.photo}
                  key={data.id}
                  darkMode={props.darkMode}
                />
              );}else if(data.type == "file"){
                return (
                  <FileMessage
                    fileName={data.fileName}
                    fileUrl={data.fileUrl}
                    darkMode={props.darkMode}
                    photo={data.photo}
                  key={data.id}
                    class={data.uid == user.uid ? "sent" : "received"}/>
                )
              }
            })
          }
      </ul>
      <form className="send-message">
        <input
          type="text"
          name="message"
          className="text-msg"
          placeholder="Message..."
          onChange={handleInput}
        />
        <button className="send-file" name="send-file-btn" onClick={uploadFile}>
          <FontAwesomeIcon icon={faPaperclip} />
        </button>
        <input
          type="file"
          className="file-input"
          accept='image/*'
          onChange={updateFile}
          style={{ display: "none" }}
        />
        {file && (
          <div className="file-container" onDoubleClick={() => setFile(null)}>
            <p className="file-name">{file.name}</p>
            <p className="file-size">{file.size} KB</p>
          </div>
        )}

        <button className="send-btn" name="send-message-btn" onClick={sendMessage}>
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </form>
    </div>
  );
}

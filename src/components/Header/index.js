import "./index.scss"

export default function Header(props) {
  
  return(
    <header className={props.darkMode? "dark" : "light"}>
      <button onClick={() => props.toggleDark()} className={props.darkMode? 'btn dark': 'btn light'}><div className="btn-circle"></div></button>
      <button onClick={props.signOut} style={props.isLoggedIn? {display: "block"} : {display: "none"}} className={`sign-out-btn ${props.darkMode? 'dark' : 'light'}`}>Sign-Out</button>
      <div className="logo">Chat-App</div>
    </header>
  )
}
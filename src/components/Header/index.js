import "./index.scss"

export default function Header(props) {
  
  return(
    <header className={props.darkMode? "dark" : "light"}>
      <button onClick={() => props.toggleDark()} className={props.darkMode? 'btn dark': 'btn light'} name='switch-dark-mode'><div className="btn-circle"></div></button>
      <button onClick={props.signOut} style={props.isLoggedIn? {display: "block"} : {display: "none"}} className={`sign-out-btn ${props.darkMode? 'dark' : 'light'}`} name='sign-out-btn'>Sign-Out</button>
      <div className="logo">Chat-App</div>
    </header>
  )
}
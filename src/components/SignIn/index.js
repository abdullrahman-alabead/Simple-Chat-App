import './index.scss'

export default function SignIn(props) {
  
  return(
    <div className='sign-in'>
      <button className={`sign-in-button ${props.darkMode? 'dark' : 'light'}`} onClick={props.signIn}>Sign In</button>
    </div>
  )
}
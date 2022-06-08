import React from 'react'
import './index.scss'

export default function Message(props) {
  

  return(
    <li className={props.darkMode? `message ${props.class} dark`: `message ${props.class} light`}>
      
      <div className='message-text'>
        <p className='name'>{props.name}</p>
        {props.message}
        {/* <p className='send-time'>{props.time}</p> */}
        </div>
        <img src={props.photo} className='prof-pic' alt='profile-photo'/>
      </li>
  )
}
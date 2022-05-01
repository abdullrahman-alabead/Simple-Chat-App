import './index.scss'
import { saveAs } from 'file-saver'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown } from '@fortawesome/free-solid-svg-icons'

export default function FileMessage(props) {

  function  saveFile(e){
    e.preventDefault();
    saveAs(props.fileUrl, props.fileName)
  }
return(
  <li className={`fileMessage ${props.darkMode? 'dark': 'light'} ${props.class}`}>
      
      <div className='message-file'>
        <button onClick={saveFile} className='download-btn' download><FontAwesomeIcon icon={faArrowDown} /></button>
        <p className='name'>{props.fileName}</p>
        </div>
        <img src={props.photo} className='prof-pic' />
      </li>
)
}
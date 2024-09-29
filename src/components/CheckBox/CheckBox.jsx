import React, { useContext, useState } from 'react'
import './CheckBox.css'
import assets from '../../assets/assets'
import { AppContext } from '../../context/AppContext'

const CheckBox = () => {

    const {userData, messagesId, chatUser, messages, setMessagesw} = useContext(AppContext)
    
    const [input, setInput] = useState("");

  return chatUser ? (
    <div className='chat-box'>
        <div className="chat-user">
            <img src={assets.profile_img} alt="" />
            <p>Richie <img className='dot' src={assets.green_dot} alt="" /></p>
            <img src={assets.help_icon} className='help' alt="" />
        </div>

        <div className="chat-message">
            <div className="s-message">
                <p className='message'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Natus, atque.</p>
                <div>
                    <img src={assets.profile_img} alt="" />
                    <p>2:30 PM</p>
                </div>
            </div>
            <div className="s-message">
                <img className='message-img' src={assets.pic1} alt="" />
                <div>
                    <img src={assets.profile_img} alt="" />
                    <p>2:30 PM</p>
                </div>
            </div>
            <div className="r-message">
                <p className='message'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Natus, atque.</p>
                <div>
                    <img src={assets.profile_img} alt="" />
                    <p>2:30 PM</p>
                </div>
            </div>
        </div>

        <div className="chat-input">
            <input type="text" placeholder='Send a message' />
            <input type="file" id='image' accept='image/png, image/jpeg' hidden />
            <label htmlFor="image">
                <img src={assets.gallery_icon} alt="" />
            </label>
            <img src={assets.send_button} alt="" />
        </div>
    </div>
  )
  : <div className='chat-wellcome'>
    <img src={assets.logo_icon} alt="" />
    <p>Chat anytime, anywhere</p>
  </div>
}

export default CheckBox
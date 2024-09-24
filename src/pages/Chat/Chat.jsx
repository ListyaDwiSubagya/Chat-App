import React from 'react'
import './Chat.css'
import LeftSidebar from '../../components/LeftSidebar/LeftSidebar'
import CheckBox from '../../components/CheckBox/CheckBox'
import RightSidebar from '../../components/RightSidebar/RightSidebar'

const Chat = () => {
  return (
    <div className='chat'>
      <div className="chat-container">
        <LeftSidebar/>
        <CheckBox/>
        <RightSidebar/>
      </div>
    </div>
  )
}

export default Chat
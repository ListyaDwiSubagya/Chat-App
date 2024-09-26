import React from 'react'
import './RightSidebar.css'
import assets from '../../assets/assets'
import { logOut } from '../../config/firebase'

const RightSidebar = () => {
  return (
    <div className='rs'>
      <div className="rs-profile">
        <img src={assets.profile_img} alt="" />
        <h3>Richie <img src={assets.green_dot} className='dot'/></h3>
        <p>Hey, There i am Richie using chat app</p>
      </div>
      <hr />
      <div className="rs-media">
        <p>Media</p>
        <div>
          <img src={assets.pic1} alt="" />
          <img src={assets.pic2} alt="" />
          <img src={assets.pic3} alt="" />
          <img src={assets.pic4} alt="" />
          <img src={assets.pic1} alt="" />
          <img src={assets.pic2} alt="" />
        </div>
      </div>
      <button onClick={() => logOut()}>Logout</button>
    </div>
  )
}

export default RightSidebar
import React, { useContext, useEffect, useState } from 'react'
import './CheckBox.css'
import assets from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { arrayUnion, doc, getDoc, onSnapshot, Timestamp, updateDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { toast } from 'react-toastify'
import upload from '../../lib/Upload'

const CheckBox = () => {

    const {userData, messagesId, chatUser, messages, setMessages} = useContext(AppContext)
    
    const [input, setInput] = useState("");

    const sendMessages = async () => {
        try {
            if (input && messagesId) {

                await updateDoc(doc(db, "messages", messagesId), {
                    messages: arrayUnion({
                        sId: userData.id,
                        text: input,
                        createdAt: new Date()
                    })
                })
    
                const userIds = [chatUser.rId, userData.id];
    
                userIds.forEach(async (id) => {
                    const userChatsRef = doc(db, "chats", id);
                    const userChatsSnapshot = await getDoc(userChatsRef);
    
                    if (userChatsSnapshot.exists()) {
                        const userChatData = userChatsSnapshot.data();
                        const chatIndex = userChatData.chatData.findIndex((c) => c.messageId === messagesId);
    
                        if (chatIndex > -1) {
                            userChatData.chatData[chatIndex].lastMessage = input.slice(0, 30); // Potong pesan jika terlalu panjang
                            userChatData.chatData[chatIndex].updatedAt = Date.now(); // Update timestamp
                            if (userChatData.chatData[chatIndex].rId === userData.id) {
                                userChatData.chatData[chatIndex].messageSeen = false;
                            }
    
                            await updateDoc(userChatsRef, {
                                chatData: userChatData.chatData
                            });
                        }
                    }
                });
            }
        } catch (error) {
            toast.error(error.message);
        }

        setInput("");
    };

    const sendImage = async (e) => {
        try {
            
            const fileUrl = await upload(e.target.files[0]);

            if (fileUrl && messagesId) {
                await updateDoc(doc(db, "messages", messagesId), {
                    messages: arrayUnion({
                        sId: userData.id,
                        image: fileUrl,
                        createdAt: new Date()
                    })
                })

                const userIds = [chatUser.rId, userData.id];
    
                userIds.forEach(async (id) => {
                    const userChatsRef = doc(db, "chats", id);
                    const userChatsSnapshot = await getDoc(userChatsRef);
    
                    if (userChatsSnapshot.exists()) {
                        const userChatData = userChatsSnapshot.data();
                        const chatIndex = userChatData.chatData.findIndex((c) => c.messageId === messagesId);
    
                        if (chatIndex > -1) {
                            userChatData.chatData[chatIndex].lastMessage = "Image"; // Potong pesan jika terlalu panjang
                            userChatData.chatData[chatIndex].updatedAt = Date.now(); // Update timestamp
                            if (userChatData.chatData[chatIndex].rId === userData.id) {
                                userChatData.chatData[chatIndex].messageSeen = false;
                            }
    
                            await updateDoc(userChatsRef, {
                                chatData: userChatData.chatData
                            });
                        }
                    }
                });
            }

        } catch (error) {
            toast.error(error.message)
        }
    } 

    const convertTimeStamp = (timestamp) => {
        let date = timestamp.toDate();
        const hour = date.getHours();
        const minute = date.getMinutes();
        if (hour > 12) {
            return hour-12 + ":" + minute + "PM";
        }
        
        else {
            return hour + ":" + minute + "AM";
        }
    }

    useEffect(() => {
        if (messagesId) {
            const unSub = onSnapshot(doc(db, "messages", messagesId), (res) => {
                setMessages(res.data().messages.reverse())
            })

            return ()=> {
                unSub();
            }
        }
    }, [messagesId])

  return chatUser ? (
    <div className='chat-box'>
        <div className="chat-user">
            <img src={chatUser.userData.avatar} alt="" />
            <p>{chatUser.userData.name} <img className='dot' src={assets.green_dot} alt="" /></p>
            <img src={assets.help_icon} className='help' alt="" />
        </div>

        <div className="chat-message">
            {messages.map((msg, index) => (
            <div key={index} className={msg.sId === userData.id ? "s-message" : "r-message"}>
                {msg["image"] 
                ? <img className='message-img' src={msg.image}/>
                :
                <p className='message'>{msg.text}</p>
                }
                <div>
                    <img src={msg.sId === userData.id ? userData.avatar : chatUser.userData.avatar} alt="" />
                    <p>{convertTimeStamp(msg.createdAt)}</p>
                </div>
            </div>
            ))}
        </div>

        <div className="chat-input">
            <input onChange={(e) => setInput(e.target.value)} value={input} type="text" placeholder='Send a message' />
            <input onChange={sendImage} type="file" id='image' accept='image/png, image/jpeg' hidden />
            <label htmlFor="image">
                <img src={assets.gallery_icon} alt="" />
            </label>
            <img onClick={sendMessages} src={assets.send_button} alt="" />
        </div>
    </div>
  )
  : <div className='chat-wellcome'>
    <img src={assets.logo_icon} alt="" />
    <p>Chat anytime, anywhere</p>
  </div>
}

export default CheckBox
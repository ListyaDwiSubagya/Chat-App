import { createContext, useEffect, useState } from "react";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'; // Optional: For showing error messages

export const AppContext = createContext();

const AppContextProvider = (props) => {

    const navigate = useNavigate();
    const [userData, setUserData] = useState(null); // Correcting the typo here
    const [chatData, setChatData] = useState(null);

    const loadUserData = async (uid) => {
        try {
            const userRef = doc(db, 'users', uid);
            const userSnap = await getDoc(userRef);
            const userData = userSnap.data(); // Renaming to match state variable
            setUserData(userData);
            if (userData.avatar && userData.name) {
                navigate('/chat');
            } else {
                navigate('/profile');
            }

            await updateDoc(userRef, {
                lastSeen: Date.now()
            });

            setInterval(async () => {
                if (auth.currentUser) { // Fixing the incorrect usage of `auth.chatUser`
                    await updateDoc(userRef, {
                        lastSeen: Date.now()
                    });
                }
            }, 6000);

        } catch (error) {
            console.error("Error loading user data:", error);
            toast.error("Failed to load user data."); // Optional: Show error notification
        }
    };

    useEffect(() => {
        if (userData) {
            const chatRef = doc(db, 'chats', userData.id);
            const unSub = onSnapshot(chatRef, async (res) => {
                const chatItems = res.data().chatData;
                const tempData = [];
                for (const item of chatItems) {
                    const userRef = doc(db, 'users', item.rId);
                    const userSnap = await getDoc(userRef);
                    const userData = userSnap.data();
                    tempData.push({ ...item, userData });
                }
                setChatData(tempData.sort((a, b) => b.updatedAt - a.updatedAt));
            });

            return () => {
                unSub(); // Proper cleanup when component unmounts
            };
        }
    }, [userData]);

    const value = {
        userData, setUserData, // Fixed variable name here as well
        chatData, setChatData,
        loadUserData
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
}

export default AppContextProvider;

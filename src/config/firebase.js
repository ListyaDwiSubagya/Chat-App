import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "",
  authDomain: "chat-app-gs-7eb5f.firebaseapp.com",
  projectId: "chat-app-gs-7eb5f",
  storageBucket: "chat-app-gs-7eb5f.appspot.com",
  messagingSenderId: "488103299151",
  appId: "1:488103299151:web:7be18b9f3da1e70c3d823a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


const signUp = async (username, email, password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password)
        const user = res.user
        await setDoc(doc(db, "users", user.uid), {
            id:user.uid,
            username:username.toLowerCase(),
            email,
            name:"",
            avatar:"",
            bio:"Hey, There i am using chat app",
            lastSeen:Date.now()
        })
        await setDoc(doc(db, "chats", user.uid),{
            chatData:[]
        })
    } catch (error) {
        console.error(error)
        toast.error(error.code)
    }
}

export {signUp}
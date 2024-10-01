import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, doc, getDocs, getFirestore, query, Query, setDoc, where } from "firebase/firestore";
import { Await } from "react-router-dom";
import { toast } from "react-toastify";

const firebaseConfig = {
    apiKey: "Your api key",
  authDomain: "your auth domain",
  projectId: "your project id",
  storageBucket: "your storage bucket",
  messagingSenderId: "your messaging sender id",
  appId: "your app id"

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
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

const login = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

const logOut = async () => {
    try {
        await signOut(auth)
    } catch (error) {
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

const resetPw = async (email) => {
    if (!email) {
        toast.error("Enter your email")
        return null;
    }
    try {
        const userRef = collection(db, 'users');
        const q = query(userRef, where("email", "", email))
        const querySnap = await getDocs(q);
        if (!querySnap.empty) {
            await sendPasswordResetEmail(auth, email);
            toast.success("Reset Email Sent")
        }
        else {
            toast.error("Email doesn't exsists")
        }
    } catch (error) {
        console.error(error);
        toast.error(error.message)
    }
}

export {signUp, login, logOut, auth, db, resetPw}

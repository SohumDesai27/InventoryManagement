// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBlp6pkm4Z-5ZdoQqMTsarsdchQAZYaGSw",
  authDomain: "inventory-managements-7edcf.firebaseapp.com",
  projectId: "inventory-managements-7edcf",
  storageBucket: "inventory-managements-7edcf.appspot.com",
  messagingSenderId: "319055569795",
  appId: "1:319055569795:web:9993364f35a292049e0cb6",
  measurementId: "G-8TBWK8VJYR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)

export {firestore}
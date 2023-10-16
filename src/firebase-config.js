// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Dodaj ten import
import { getFirestore } from "firebase/firestore"; // Dodaj ten import

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBCMMPqU46hI2U55FVBzr_DHD113xSjLqw",
    authDomain: "pod-kontrola.firebaseapp.com",
    databaseURL: "https://pod-kontrola-default-rtdb.firebaseio.com",
    projectId: "pod-kontrola",
    storageBucket: "pod-kontrola.appspot.com",
    messagingSenderId: "1065887098077",
    appId: "1:1065887098077:web:7b2828f5bf46da8e8c2734"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

// export const database = getDatabase(app, "https://react-project-3ae6c-default-rtdb.europe-west1.firebasedatabase.app/");


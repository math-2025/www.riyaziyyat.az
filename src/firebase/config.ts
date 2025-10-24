// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDp0vHWuDDdWE7rnU2sTbykK3feU18Ic8U",
  authDomain: "riyaziyyat-az-db.firebaseapp.com",
  projectId: "riyaziyyat-az-db",
  storageBucket: "riyaziyyat-az-db.firebasestorage.app",
  messagingSenderId: "1035975521809",
  appId: "1:1035975521809:web:70bf42a67c3000997f63b0",
  measurementId: "G-CYZ0958TV5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export { app };

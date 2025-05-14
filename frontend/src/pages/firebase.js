// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA4cT3dko98HfV0qeh00xCohbEs6nR2FpI",
  authDomain: "leftover-chef-1044f.firebaseapp.com",
  projectId: "leftover-chef-1044f",
  storageBucket: "leftover-chef-1044f.firebasestorage.app",
  messagingSenderId: "541119913136",
  appId: "1:541119913136:web:ce9073bbee18e94820af75",
  measurementId: "G-NBFD9HN4S3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { auth };
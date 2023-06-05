import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
//   apiKey: process.env.REACT_APP_API_KEY,
//   authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGEING_SENDER_ID,
//   appId: process.env.REACT_APP_APP_ID,
  apiKey: AIzaSyBXgb7VEU9e4tE1qFDLRpuYY-7nqK5omuM,
  authDomain: term3-mahiro-suematsu.firebaseapp.com,
  projectId: term3-mahiro-suematsu,
  storageBucket: term3-mahiro-suematsu.appspot.com,
  messagingSenderId: 309741794676,
  appId: c85c29add1d0f5c9092821,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const fireAuth = getAuth(app);
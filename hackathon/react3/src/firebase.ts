import { initializeApp } from "firebase/app";
import { getAuth }  from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGEING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

// Firebaseを初期化
const app = initializeApp(firebaseConfig);

// Firebaseの認証インスタンスを取得
export const fireAuth = getAuth(app);
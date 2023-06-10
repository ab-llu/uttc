import React from "react";
import { useEffect } from "react";
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import UserSettings from "./UserSettings";
import { onAuthStateChanged } from "firebase/auth";
import "firebase/auth";
import { fireAuth } from "./firebase";
import Post from "./MessagePost";
import Display from "./MessageDisplay";
import Rand from "./MessageRand";
import { useNavigate } from 'react-router-dom';
import firebase from "firebase/compat/app";
import 'firebase/compat/auth';

type Props = {
  channel: string;
};

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGEING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

firebase.initializeApp(firebaseConfig);

function App() {
  const [loginUser, setLoginUser] = useState(fireAuth.currentUser);

  onAuthStateChanged(fireAuth, (user) => {
    setLoginUser(user);
  });

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Top />} />
          <Route path="/general" element={<General channel="general" />} />
          <Route path="/random" element={<Random channel="random" />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signout" element={<SignOut />} />
          <Route path="/user" element={<UserSettings />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

function Top() {
  const [loginUser, setLoginUser] = useState(fireAuth.currentUser);
  onAuthStateChanged(fireAuth, (user) => {
    setLoginUser(user);
  });

  return (
    <div>
      {loginUser ?
        <div>
          <header>
            <h1>ようこそ</h1>
          </header>
          <ul>
            <li>
              <a href="/general">General</a>
            </li>
            <li>
              <a href="/random">Random</a>
            </li>
            <li>
              <a href="./user">アカウント設定</a>
            </li>
            <li>
              <a href="/signout">ログアウト</a>
            </li>
          </ul>
        </div>
      :
        <div className="Top">
          <header>
            <div><h1>FLASH</h1></div>
          </header>
          <div className="body1">
            <div>
              <div className="h1"><h1>躍動 と 興奮</h1></div>
              <div className="h2"><h2>新時代のメッセージアプリ</h2></div>
            </div>
            <div className="red"></div>
            <div className="yellow"></div>
            <div className="green"></div>
          </div>
          <div className="body2">
            <div className="start"><h1>今すぐ始めよう</h1></div>
            <div className="enroll">
                <div><a href="/signup">ユーザー登録</a></div>
                <div><a href="/signin">ログイン</a></div>
            </div>
          </div>
        </div>
      }
    </div>
  );
}

function General(props: Props) {
  const loginUser = fireAuth.currentUser;

  const channelName = props.channel;
  return (
    <div>
      {loginUser ?
        <div className="channel">
          <header className="head">
            <div className="logo"><a href="/">FLASH</a></div>
            <div className="account"><a href="./user">アカウント設定</a></div>
          </header>
          <div className="rand"><Rand channel={channelName} /></div>
          <div className="post"><Post channel={channelName} /></div>
        </div>
      : null}
    </div>
  )
}

function Random(props: Props) {
  const loginUser = fireAuth.currentUser;

  const channelName = props.channel;
  return (
    <div>
      {loginUser ?
        <div className="channel">
          <header className="head">
            <div className="logo"><a href="/">FLASH</a></div>
            <div className="account"><a href="./user">アカウント設定</a></div>
          </header>
          <div className="rand"><Rand channel={channelName} /></div>
          <div className="post"><Post channel={channelName} /></div>
        </div>
      : null}
    </div>
  )
}

function SignOut() {
  const [loginUser, setLoginUser] = useState(fireAuth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(fireAuth, (user) => {
        setLoginUser(user);
    });

    return () => {
        unsubscribe();
    }
  }, []);

  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await firebase.auth().signOut();
      console.log('Successfully signed out');
      navigate("/");
    } catch (error) {
      console.log('Fail: sign out', error);
    }
  };

  const handleBack = () => {
    navigate("/")
  }

  return (
    <div>
      {loginUser ?
        <div className="App">
          <h1>ログアウトしますか？</h1>
          <button onClick={handleSignOut}>
            はい
          </button>
          <button onClick={handleBack}>
            いいえ
          </button>
        </div>
      : null}
    </div>

  )
}

export default App;

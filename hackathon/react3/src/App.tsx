import React from "react";
import { useEffect } from "react";
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import { onAuthStateChanged } from "firebase/auth";
import "firebase/auth";
import { fireAuth } from "./firebase";
import Post from "./Post";
import Display from "./Display";
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
    <div className="App">
      {loginUser ?
        <div>
          <header>
            <h1>Welcome! {loginUser.email}</h1>
          </header>
          <ul>
            <li>
              <a href="/general">General</a>
            </li>
            <li>
              <a href="/random">Random</a>
            </li>
            <li>
              <a href="/signout">Sign Out</a>
            </li>
          </ul>
        </div>
      :
        <div>
          <header>
            <h1>Please sign in</h1>
          </header>
          <ul>
            <li>
              <a href="/signin">Sign in</a>
            </li>
            <li>
              <a href="/signup">Sign up</a>
            </li>
          </ul>
        </div>
      }
    </div>
  );
}

function General(props: Props) {
  const [loginUser, setLoginUser] = useState(fireAuth.currentUser);
  onAuthStateChanged(fireAuth, (user) => {
    setLoginUser(user);
  });

  const channelName = props.channel;
  return (
    <div>
      {loginUser ?
        <div>
          <h1>{loginUser.email}</h1>
          <Post channel={channelName} />
          <Display channel={channelName} />
        </div>
      : null}
    </div>
  )
}

function Random(props: Props) {
  const [loginUser, setLoginUser] = useState(fireAuth.currentUser);
  onAuthStateChanged(fireAuth, (user) => {
    setLoginUser(user);
  });

  const channelName = props.channel;
  return (
    <div>
      {loginUser ?
        <div>
          <h1>{loginUser.email}</h1>
          <Post channel={channelName} />
          <Display channel={channelName} />
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

  return (
    <div>
      {loginUser ?
        <div className="App">
          <h1>Are you sure to sign out?</h1>
          <button onClick={handleSignOut}>
            Yes
          </button>
        </div>
      : null}
    </div>

  )
}

export default App;

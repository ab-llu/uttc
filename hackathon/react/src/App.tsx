import React from 'react';
import './App.css';
import Post from "./Post"
import Display from "./Display"
import AddChannel from "./Channel"
import LoginForm from "./LoginForm"
import { onAuthStateChanged } from "firebase/auth";
import { fireAuth } from "./firebase";
import { useState } from "react";

function App() {
  // stateとしてログイン状態を管理する。ログインしていないときはnullになる。
  const [loginUser, setLoginUser] = useState(fireAuth.currentUser);

  // ログイン状態を監視して、stateをリアルタイムで更新する
  onAuthStateChanged(fireAuth, user => {
    setLoginUser(user);
  });

  return (
    <div className="App">
      <LoginForm/>
      {/* ログインしていないと見られないコンテンツは、loginUserがnullの場合表示しない */}
      {loginUser ? <Display /> : null}
      <header className="App-header">
        <h1>Enter Message</h1>
      </header>
      <Post/>
      <div className="App-header">
        <h1>Message Log</h1>
      </div>
      <Display/>
      <div className="App-header">
        <h1>Add channel</h1>
      </div>
      <AddChannel/>
    </div>
  );
}

export default App;

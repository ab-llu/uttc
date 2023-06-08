import React from "react";
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import { onAuthStateChanged } from "firebase/auth";
import { User } from "firebase/auth"
import { fireAuth } from "./firebase";
import Post from "./Post";
import Display from "./Display";

type Props = {
  channel: string;
  user: User | null;
};

type PropsUser = {
  user: User | null;
};

function App() {
  const [loginUser, setLoginUser] = useState(fireAuth.currentUser);

  onAuthStateChanged(fireAuth, (user) => {
    setLoginUser(user);
  });

  return (
    <div>
      <BrowserRouter>
        <SignUp />
        <SignIn />
      </BrowserRouter>
      {loginUser ? (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Top user={fireAuth.currentUser} />} />
            <Route path="/general" element={<General channel="general" user={loginUser} />} />
            <Route path="/random" element={<Random channel="random" user={loginUser} />} />
          </Routes>
        </BrowserRouter>
      ) : null}
    </div>
  );
}

function Top(props: PropsUser) {
  const user = props.user;
  return (
    <div className="App">
      <ul>
        <li>
          <a href="/general">General</a>
        </li>
        <li>
          <a href="/random">Random</a>
        </li>
      </ul>
      <Routes>
        <Route path="/general" element={<General channel="general" user={user} />} />
        <Route path="/random" element={<Random channel="random" user={user} />} />
      </Routes>
    </div>
  );
}

function General(props: Props) {
  const channelName = props.channel;
  const user = props.user;
  return (
    <div>
      <Post channel={channelName} user={user} />
      <Display channel={channelName} user={user} />
    </div>
  )
}

function Random(props: Props) {
  const channelName = props.channel;
  const user = props.user;
  return (
    <div>
      <Post channel={channelName} user={user} />
      <Display channel={channelName} user={user} />
    </div>
  )
}

export default App;

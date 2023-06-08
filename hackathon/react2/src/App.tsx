import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { onAuthStateChanged } from "firebase/auth";
import { fireAuth } from "./firebase";
import Post from "./Post";
import Display from "./Display";

function App() {
  return (
    <BrowserRouter>
      <Route exact path="/" component={Home} />
      <Route path="/log" component={Log} />
    </BrowserRouter>
  );
}

function Home() {
  const [loginUser, setLoginUser] = useState(fireAuth.currentUser);
  onAuthStateChanged(fireAuth, user => {
    setLoginUser(user);
  });
  return (
    <div>
      <LoginForm />
      {loginUser ? <Post /> : null}
    </div>
  );
};

function Log() {
  return (
    <div>
      <Display />
    </div>
  )
}

export default App;

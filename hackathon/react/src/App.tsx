import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import LoginForm from "./LoginForm"

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>User Register</h1>
      </header>
      <LoginForm/>
    </div>
  );
}

export default App;

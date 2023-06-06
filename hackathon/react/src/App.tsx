import React from 'react';
import './App.css';
import Post from "./Post"
import Display from "./Display"
import AddChannel from "./Channel"

function App() {
  return (
    <div className="App">
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

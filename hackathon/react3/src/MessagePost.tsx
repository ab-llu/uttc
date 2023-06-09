import { useState } from "react";
import React from "react";
import { User } from "firebase/auth";
import { fireAuth } from "./firebase";

type Props = {
  channel: string;
};

const Post = (props: Props) => {
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!message) {
      alert("Please enter message");
      return;
    }

    try {
      const response = await fetch(
        "https://uttc-lnzf2ojmsq-uc.a.run.app/message",
        {
          mode: "cors",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Request-Methods": "POST",
            "Access-Control-Request-Headers": "Content-Type"
          },
          body: JSON.stringify({
            user,
            channel,
            message
          }),
        }
      );
      if (!response.ok) {
        throw Error(`Failed to post messages: ${response.status}`);
      }
      console.log("response is...", response);
    } catch(err) {
      console.error(err);
    }  
  };

  const currentUser: User | null = fireAuth.currentUser;
  const user: string = currentUser ? currentUser.uid: "";
  const channel = props.channel;
  const [message, setMessage] = useState("");

  return (
    <div className="App">
      <header>
        <h1>Post Message</h1>
      </header>
      <form onSubmit={onSubmit}>
        <div>
          <div className="box_l"><label>Message: </label></div>
          <div className="box_i"><input
            type={"text"}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></input></div>
        </div>
        <button type={"submit"}>Submit</button>
      </form>
    </div>
  );
};

export default Post;
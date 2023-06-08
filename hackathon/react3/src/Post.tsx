import { useState } from "react";
import React from "react";
import { User } from "firebase/auth";

type Props = {
  channel: string;
  user: User | null;
};

const Post = (props: Props) => {
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!message) {
      alert("Please enter message");
      return;
    }

    if (user.length > 50) {
      alert("Please enter a name shorter than 50 characters");
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
      console.log(props.user);
    } catch(err) {
      console.error(err);
    }  
  };

  const [user, setUser] = useState("");
  const channel = props.channel;
  const [message, setMessage] = useState("");

  return (
    <form onSubmit={onSubmit}>
      <div>
        <div className="box_l"><label>User: </label></div>
        <div className="box_i"><input
          type={"text"}
          value={user}
          onChange={(e) => setUser(e.target.value)}
        ></input></div>
      </div>
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
  );
};

export default Post;
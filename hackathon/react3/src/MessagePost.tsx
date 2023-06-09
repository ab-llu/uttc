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
            message,
            importance
          }),
        }
      );
      if (!response.ok) {
        throw Error(`Failed to post messages: ${response.status}`);
      }
      console.log("response is...", response);
      setMessage("");
      setImportance(0);
    } catch(err) {
      console.error(err);
    }  
  };

  const currentUser: User | null = fireAuth.currentUser;
  const user: string = currentUser ? currentUser.uid: "";
  const channel = props.channel;
  const [message, setMessage] = useState("");
  const [importance, setImportance] = useState(0);

  return (
    <div className="App">
      <div className="post-container">
        <form onSubmit={onSubmit}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="メッセージを入力"
          ></textarea>
          <div>
            <button type={"button"} className="star" onClick={() => setImportance(1)}>{importance > 0 ? "★":"☆"}</button>
            <button type={"button"} className="star" onClick={() => setImportance(2)}>{importance > 1 ? "★":"☆"}</button>
            <button type={"button"} className="star" onClick={() => setImportance(3)}>{importance > 2 ? "★":"☆"}</button>
            <button 
              type={"submit"}
              className="submit"
              disabled={message=="" || importance==0}
            >投稿</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Post;
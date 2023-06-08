import React from 'react';
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { fireAuth } from "./firebase";

export default function SignUp() {
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        fireAuth,
        email as string,
        password as string
      );      
      const user = userCredential.user;
      
      // Get the JWT and decode it to get the 'sub'
      const token = await user.getIdToken();
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const sub = decodedToken.sub;

      const additionalData = {
        uid: user.uid,
        email: email,
        name: name,
      };      

      console.log("Client-side data:", additionalData);

      const response = await fetch("https://uttc-lnzf2ojmsq-uc.a.run.app/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(additionalData),
      });

      if (response.ok) {
        console.log("Registration successful!");
      } else {
        console.error("Registration failed");
      }
    } catch (error) {
        console.error("Error signing up:", error);
    }
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  return (
    <div>
        <form onSubmit={handleSubmit}>
            <div>
                <div className="box_l"><label>Email: </label></div>
                <div className="box_i"><input
                    type={"email"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                ></input></div>
            </div>
            <div>
                <div className="box_l"><label>Password: </label></div>
                <div className="box_i"><input
                    type={"password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                ></input></div>
            </div>
            <div>
                <div className="box_l"><label>Display Name: </label></div>
                <div className="box_i"><input
                    type={"text"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                ></input></div>
            </div>
            <button type={"submit"}>Submit</button>
        </form>
    </div>
  );
}
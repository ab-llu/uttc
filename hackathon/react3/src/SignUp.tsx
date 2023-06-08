import React from 'react';
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { fireAuth } from "./firebase";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [loginUser, setLoginUser] = useState(fireAuth.currentUser);

  onAuthStateChanged(fireAuth, (user) => {
    setLoginUser(user);
  });

  const navigate = useNavigate();

  type UserInfo = {
    id: string,
    name: string,
    email: string,
  }
  
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
        var userData: UserInfo = {
            id: user.uid,
            name: name,
            email: email
        }
        navigate('/', { state: { data: userData } });
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
        {loginUser ?
            <div className="App">
                <h1>You have already signed in</h1>
                <a href="/">Back to top</a>
            </div>
        :
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
        }
    </div>
  );
}
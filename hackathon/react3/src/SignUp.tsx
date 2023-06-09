import React from 'react';
import { useEffect } from "react";
import { useState } from "react";
import { ChangeEvent } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { fireAuth } from "./firebase";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
    const [loginUser, setLoginUser] = useState(fireAuth.currentUser);

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(fireAuth, (user) => {
          setLoginUser(user);
      });
  
      return () => {
          unsubscribe();
      }
    }, []);

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
        if (error="Firebase: Error (auth/email-already-in-use).") {
            setErrorMessage("エラー　別のメールアドレスを入力してください")
        } else {
            alert(error);
        };
    }
  };

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (e.target.value == "") {
        setEmailError("メールアドレスを入力してください")
    } else if (!isEmailValid(e.target.value)) {
        setEmailError("メールアドレスの形式が正しくありません")
    } else {
        setEmailError("")
    }
  }

  const isEmailValid = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    if (e.target.value == "") {
        setPasswordError("パスワードを入力してください")
    } else if (e.target.value.length < 6) {
        setPasswordError("パスワードは６文字以上です")
    } else {
        setPasswordError("")
    }
  }

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
    if (e.target.value == "") {
        setNameError("表示名を入力してください")
    } else if (e.target.value.length > 20) {
        setNameError("表示名は20文字以内で入力してください")
    } else {
        setNameError("")
    }
  }

  return (
    <div>
        {loginUser ?
            <div className="App">
                <h1>You have already signed in</h1>
                <a href="/">Back to top</a>
            </div>
        :
        <div className="App">
            <header>
                <h1>ユーザー登録</h1>
            </header>
            <form onSubmit={handleSubmit}>
                <div>
                    <div className="box_l"><label>メールアドレス</label></div>
                    <div className="box_i"><input
                        type={"email"}
                        value={email}
                        onChange={handleEmailChange}
                    ></input></div>
                </div>
                {emailError ?? <div className="error"><h3>{emailError}</h3></div>}
                <div>
                    <div className="box_l"><label>パスワード</label></div>
                    <div className="box_i"><input
                        type={"password"}
                        value={password}
                        onChange={handlePasswordChange}
                    ></input></div>
                </div>
                {passwordError ?? <div className="error"><h3>{passwordError}</h3></div>}
                <div>
                    <div className="box_l"><label>表示名</label></div>
                    <div className="box_i"><input
                        type={"text"}
                        value={name}
                        onChange={handleNameChange}
                    ></input></div>
                </div>
                {nameError ?? <div className="error"><h3>{nameError}</h3></div>}
                <button type={"submit"} disabled={emailError!="" || passwordError!="" || nameError!="" || email=="" || password=="" || name==""}>Submit</button>
            </form>
            {errorMessage ?? <div className="error"><h3>{errorMessage}</h3></div>}
            <div><a href="./signin">登録済みのアカウントにログイン</a></div>
        </div>
        }
    </div>
  );
}
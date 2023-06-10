import React from 'react';
import { useEffect } from "react";
import { useState } from "react";
import { ChangeEvent } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { onAuthStateChanged, User } from "firebase/auth";
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

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [signUpState, setSignUpState] = useState(1);

  const initialUser = fireAuth.currentUser;
  const [user, setUser] = useState<User | null>(initialUser);

  const handleSubmit1 = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
        const userCredential = await createUserWithEmailAndPassword(
          fireAuth,
          email as string,
          password as string
        );      
        setUser(userCredential.user);
    } catch (error) {
        console.error("Error signing up:", error);
        if (error="Firebase: Error (auth/email-already-in-use).") {
            setErrorMessage("エラー　別のメールアドレスを入力してください")
        } else {
            alert(error);
        };
    }
    if (user !== null) {
        setSignUpState(2);
    }
  }

  const handleSubmit2 = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (user === null) {
        return;
    }
    try {
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

  }
  
//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     try {
//       const userCredential = await createUserWithEmailAndPassword(
//         fireAuth,
//         email as string,
//         password as string
//       );      
//       const user = userCredential.user;

//       const additionalData = {
//         uid: user.uid,
//         email: email,
//         name: name,
//       };      

//       console.log("Client-side data:", additionalData);

//       const response = await fetch("https://uttc-lnzf2ojmsq-uc.a.run.app/user/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(additionalData),
//       });

//       if (response.ok) {
//         console.log("Registration successful!");
//         var userData: UserInfo = {
//             id: user.uid,
//             name: name,
//             email: email
//         }
//         navigate('/', { state: { data: userData } });
//       } else {
//         console.error("Registration failed");
//       }
//     } catch (error) {
//         console.error("Error signing up:", error);
//         if (error="Firebase: Error (auth/email-already-in-use).") {
//             setErrorMessage("エラー　別のメールアドレスを入力してください")
//         } else {
//             alert(error);
//         };
//     }
//   };

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
    } else if (e.target.value.length > 5) {
        setNameError("表示名は5文字以内で入力してください")
    } else {
        setNameError("")
    }
  }

  return (
    <div>
        <div className="Register">
            <header>
                <h1>さあ、新しい旅を始めよう</h1>
            </header>
            <body>
                {signUpState == 1 ?
                    <div className="block">
                        <div className="auth">
                            <div><h1 className="step1">①　認証情報の入力</h1></div>
                            <div><form onSubmit={handleSubmit1}>
                                <div className="input-container"><input
                                    className="inputBox"
                                    type={"email"}
                                    value={email}
                                    placeholder="メールアドレス"
                                    onChange={handleEmailChange}
                                ></input></div>
                                {emailError ?? <div className="error"><h3>{emailError}</h3></div>}
                                <div className="input-container"><input
                                    className="inputBox"
                                    type={"password"}
                                    value={password}
                                    placeholder="パスワード"
                                    onChange={handlePasswordChange}
                                ></input></div>
                                {passwordError ?? <div className="error"><h3>{passwordError}</h3></div>}
                                <button type={"submit"} disabled={emailError!="" || passwordError!="" || email=="" || password==""}>登録</button>
                                {errorMessage ?? <div className="error"><h3>{errorMessage}</h3></div>}
                            </form></div>
                        </div>
                        <div className="signin">
                            <div><h3>既にアカウントをお持ちですか？</h3></div>
                            <div><a href="./signin">登録済みのアカウントにログイン</a></div>
                        </div>
                    </div>
                : null}
                {signUpState == 2 ?
                    <div className="block">
                        <div className="auth">
                            <div><h1 className="step2">②　表示名の入力</h1></div>
                            <div><form onSubmit={handleSubmit2}>
                                <div className="input-container"><input
                                        className="inputBox"
                                        type={"text"}
                                        value={name}
                                        placeholder={"表示名"}
                                        onChange={handleNameChange}
                                ></input></div>
                                {nameError ?? <div className="error"><h3>{nameError}</h3></div>}
                                <button type={"submit"} disabled={nameError!="" || name==""}>登録して始める</button>
                            </form></div>
                        </div>
                    </div>
                : null}
            </body>   
        </div>
    </div>
  );
}
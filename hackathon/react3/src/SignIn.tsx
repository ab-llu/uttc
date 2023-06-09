import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { ChangeEvent } from 'react';
import { fireAuth } from './firebase';
import { onAuthStateChanged } from "firebase/auth";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';


export default function SignIn() {

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

  const fetchData = async (uid: string) => {
    try {
      const response = await fetch(`https://uttc-lnzf2ojmsq-uc.a.run.app/user/register?uid=${uid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data: UserInfo = await response.json() as UserInfo;
        console.log('Fetched data:', data);
        return data; 
      } else {
        console.error('Failed to fetch data:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      // Firebase Authenticationを使ってメールアドレスとパスワードでログイン
      const userCredential = await signInWithEmailAndPassword(fireAuth, email, password);
      const user = userCredential.user;
      console.log('Logged in user:', user);

      const fetchedData = await fetchData(user.uid);

      // ホーム画面へ遷移, データをstateに渡す
      navigate('/');
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.code && error.message) {
        if (error.message="Firebase: Error (auth/wrong-password).") {
            setErrorMessage("エラー　メールアドレスまたはパスワードが間違っています")
        } else {
            alert(error.message);
        };
      } else {
        console.error('Unexpected error:', error);
        alert('An unexpected error occurred.');
      }
    }
  };

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
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

  return (
    <div>
        {loginUser ? 
            <div className="App">
                <h1>既にログインしています</h1>
                <a href="/">トップに戻る</a>
            </div>
        :
            <div className="App">
                <header>
                    <h1>ログイン</h1>
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
                    <button type={"submit"} disabled={emailError!="" || passwordError!="" || email=="" || password==""}>Submit</button>
                </form>
                {errorMessage ?? <div className="error"><h3>{errorMessage}</h3></div>}
                <div><a href="/signup">新規ユーザー登録</a></div>
            </div>
        }
    </div>
  );
}
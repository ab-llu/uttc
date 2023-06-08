import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
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
        alert(error.message);
      } else {
        console.error('Unexpected error:', error);
        alert('An unexpected error occurred.');
      }
    }
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
        {loginUser ? 
            <div className="App">
                <h1>You have already signed in</h1>
                <a href="/">Back to top</a>
            </div>
        :
            <div className="App">
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
                    <button type={"submit"}>Submit</button>
                </form>
                <a href="/signup">Sign up</a>
            </div>
        }
    </div>
  );
}
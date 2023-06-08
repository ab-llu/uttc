import React from 'react';
import { useState } from 'react';
import { fireAuth } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function SignIn() {
  const navigate = useNavigate();

  const fetchData = async (idToken: string) => {
    try {
      const response = await fetch(`https://uttc-lnzf2ojmsq-uc.a.run.app/user/register`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
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

      // FirebaseからIDトークンを取得
      const idToken = await user.getIdToken();

      const fetchedData = await fetchData(idToken);

      // ホーム画面へ遷移, データをstateに渡す
      navigate('/home', { state: { data: fetchedData } });
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
    </div>
  );
}
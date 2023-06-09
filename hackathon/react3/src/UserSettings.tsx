import React from "react";
import { useEffect, useState } from "react";
import "firebase/auth";
import { fireAuth } from "./firebase";
import { User } from "firebase/auth";

const UserSettings = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    type UserInfo = {
        id: string,
        name: string,
        email: string,
    }

    const currentUser = fireAuth.currentUser;
    const currentUserId = currentUser ? currentUser.uid: null;

    const [currentUserId2, setCurrentUserId2] = useState("");

    useEffect(() => {
      const currentUser2 = fireAuth.currentUser;
      if (currentUser2 != null) {
        setCurrentUserId2(currentUser2.uid);
      }
    }, [currentUser]);
    
    useEffect(() => {
      if (currentUserId2 !== "") {
        const fetchData = async () => {
            try {
              const response = await fetch(`https://uttc-lnzf2ojmsq-uc.a.run.app/user/register?uid=${currentUserId2}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
              });
        
              if (response.ok) {
                const data: UserInfo = await response.json() as UserInfo;
                console.log('Fetched data:', data);
                setName(data.name);
                setEmail(data.email); 
              } else {
                console.error('Failed to fetch data:', response);
              }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
      }
    }, [currentUserId2]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(currentUserId);
        console.log(name);

        try {
            const response = await fetch(
              "https://uttc-lnzf2ojmsq-uc.a.run.app/user/edit",
              {
                mode: "cors",
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Access-Control-Request-Methods": "POST",
                  "Access-Control-Request-Headers": "Content-Type"
                },
                body: JSON.stringify({
                  currentUserId,
                  name,
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
    }

    return (
        <div>
            {currentUserId ?
                <div className="App">
                    <header>
                        <h1>アカウント設定</h1>
                    </header>
                    <h3>表示名： {name}</h3>
                    <h3>メールアドレス： {email}</h3>
                    <h2>表示名を変更</h2>
                    <form onSubmit={handleSubmit}>
                    <div>
                        <div className="box_l"><label>新しい表示名</label></div>
                        <div className="box_i"><input
                            type={"text"}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        ></input></div>
                    </div>
                    <button type={"submit"}>変更</button>
                </form>
                <a href="/">トップに戻る</a>
                </div>
            :
                <div className="App">
                    <header>
                        <h1>ログインしてください</h1>
                    </header>
                    <ul>
                        <li>
                            <a href="/signin">ログイン</a>
                        </li>
                        <li>
                            <a href="/signup">ユーザー登録</a>
                        </li>
                    </ul>
                </div>
            }
        </div>
    )
}

export default UserSettings;
import { useState, useEffect } from "react";
import React from "react";
import { User } from "firebase/auth";
import { fireAuth } from "./firebase";
import moon from "./img/moon.png"

type Props = {
    channel: string;
  };

const Rand = (props: Props) => {
    type MessageInfo = {
        messageId: string,
        posted_at: string,
        user: string,
        userID: string,
        message: string,
        edit: boolean,
        importance: number,
    }
    type MessageInfos = {
        messageId: string,
        posted_at: string,
        user: string,
        userID: string,
        message: string,
        edit: boolean
        importance: number,
    }[];
    const defaultData: MessageInfos = [{
        messageId: '0',
        posted_at: '2023-06-04 12:00:00',
        user: 'hanako',
        userID: "",
        message: 'Hello!',
        edit: false,
        importance: 1,
    }];

    function editIf(bool: boolean) {
        if (bool) {
            return "(編集済み)"
        }
        return ""
    };

    function shorten(message: string) {
        if (message.length <= 15) {
            return message;
        } else {
            return message.slice(0,15) + "..."
        }
    };

    const [datalist1, setDatalist1] = useState(defaultData.map((data)=><h1 key={data["messageId"]}>{data["posted_at"]} {data["user"]} {data["message"]} {editIf(data["edit"])}</h1>));
    const [datalist2, setDatalist2] = useState(defaultData.map((data)=><h1 key={data["messageId"]}>{data["posted_at"]} {data["user"]} {data["message"]} {editIf(data["edit"])}</h1>));
    const [datalist3, setDatalist3] = useState(defaultData.map((data)=><h1 key={data["messageId"]}>{data["posted_at"]} {data["user"]} {data["message"]} {editIf(data["edit"])}</h1>));
    const [datalist4, setDatalist4] = useState(defaultData.map((data)=><h1 key={data["messageId"]}>{data["posted_at"]} {data["user"]} {data["message"]} {editIf(data["edit"])}</h1>));
    const channel = props.channel

    const DisplayData = (data: MessageInfo) => {
        let backgroundColor;

        switch (data.importance) {
          case 1:
            backgroundColor = "green";
            break;
          case 2:
            backgroundColor = "yellow";
            break;
          case 3:
            backgroundColor = "red";
            break;
          default:
            backgroundColor = "black";
            break;
        }
        return (
            <button
                onClick={handleClick(data)}
                className="box_h"
                style={{ backgroundColor }}
                disabled={editShown || detailShown}
            >
                <div key={data["messageId"]}>
                    <div className="iconuser">
                        <img className="icon" src={moon}/>
                        <div className="user">{data["user"]}</div>
                    </div>
                    <div className="timecontent">
                        <div className="timeedit">
                            <div className="time">{atob(data["posted_at"])}</div>
                            <div className="edit">{editIf(data["edit"])}</div>
                        </div>
                        <div className="content">{shorten(data["message"])}</div>
                    </div>   
                </div>
            </button>
        )
    }
    
    const fetchUsers = async (leastStars: number, withinDay: boolean) => {
        try {
            const response: Response = await fetch(
                `https://uttc-lnzf2ojmsq-uc.a.run.app/message/fetch?channel=${channel}&leastStars=${leastStars}&withinDay=${withinDay}`,
                {
                    mode: "cors",
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Request-Methods": "GET",
                        "Access-Control-Request-Headers": "Content-Type"
                    },
                }
            );
            if (!response.ok) {
                throw Error(`Failed to fetch messages: ${response.status}`);
            }
            console.log("response is...", response);
            const info: MessageInfos = await response.json() as MessageInfos;
            setDatalist1(info.slice(0,3).map(DisplayData))
            setDatalist2(info.slice(3,6).map(DisplayData))
            setDatalist3(info.slice(6,9).map(DisplayData))
            setDatalist4(info.slice(9,12).map(DisplayData))
        } catch(err) {
            console.error(err);
        }
    }

    const [count, setCount] = useState(0);
    const [timer, setTimer] = useState(5000);
    const [leastStars, setLeastStars] = useState(1);
    const [withinDay, setWithinDay] = useState(false); //検索する時間の範囲。falseは全て、trueは１日以内

    const handleStop = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (timer == 5000) {
            setTimer(1000000000);
        } else {
            setTimer(5000);
            setCount(0);
        };
    };

    const handleStar = (event: React.MouseEvent<HTMLButtonElement>) => {
        switch (leastStars) {
            case 1:
                setLeastStars(2);
                break;
            case 2:
                setLeastStars(3);
                break;
            case 3:
                setLeastStars(1);
                break;
        }
    }

    const handleDay = (event: React.MouseEvent<HTMLButtonElement>) => {
        setWithinDay(!withinDay);
    }

    useEffect(() => {
        fetchUsers(leastStars, withinDay);

        const interval = setInterval(() => {
            setCount(prevCount => prevCount + 1);
        }, timer);
      
        return () => {
            clearInterval(interval);
        };
    },[count])

    const currentUser: User | null = fireAuth.currentUser;
    const currentuserID: string = currentUser ? currentUser.uid: "";
    const [edited, setEdited] = useState("")
    const [id, setId] = useState("") //id of the edited message

    function handleClick(data: MessageInfo) {
        const userID: string = data.userID;
        console.log("Clicked");
        return function(event: React.MouseEvent<HTMLButtonElement>) {
            if (userID === currentuserID) {
                console.log(editShown);
                console.log("user ok");
                event.preventDefault();
                setEditShown(true);
                setEdited(data.message);
                setId(data.messageId);
            }else{
                setDetailShown(true);
                setEdited(data.message);
            }
        };
    }

    const [editShown, setEditShown] = useState(false)
    const [detailShown, setDetailShown] = useState(false)
      
    const handleCloseButtonClick = () => {        
        setEditShown(false);
        setDetailShown(false);
    }

    const EditMessage = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setEditShown(false);
        try {
            const response: Response = await fetch(
                `https://uttc-lnzf2ojmsq-uc.a.run.app/message/edit`,
                {
                    mode: "cors",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Request-Methods": "POST",
                        "Access-Control-Request-Headers": "Content-Type"
                    },
                    body: JSON.stringify({
                        id,
                        edited
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

    function DeleteMessage() {
        return async function(event: React.MouseEvent<HTMLButtonElement>) {
            event.preventDefault();
            setEditShown(false);
            try {
                const response: Response = await fetch(
                    `https://uttc-lnzf2ojmsq-uc.a.run.app/message/delete`,
                    {
                        mode: "cors",
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Access-Control-Request-Methods": "POST",
                            "Access-Control-Request-Headers": "Content-Type"
                        },
                        body: JSON.stringify({
                            id
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
        };
    }
    
    return (
        <div>
            <div className="menu">
                <div className="channelName"><h1>{props.channel}</h1></div>
                <div className="buttons">
                    <button onClick={handleStop}>{timer > 100000 ? "⏯️" : "⏸"}</button>
                    <button onClick={handleStar}>{leastStars == 1 ? "★" : (leastStars == 2 ? "★★" : "★★★")}</button>
                    <button onClick={handleDay}>{withinDay ? "📅" : "🕑"}</button>
                </div>

            </div>
            <div className="popup-menu-container">
                <div className="column">
                    <div className="list">{datalist3}</div>
                    <div className="list">{datalist1}</div>
                    <div className="list">{datalist4}</div>
                    <div className="list">{datalist2}</div>
                </div>
                <div
                    className={`popup-menu ${editShown ? 'shown' : ''}`}
                >
                    <h1>メッセージを編集</h1>
                    <form onSubmit={EditMessage}>
                        <textarea
                            value={edited}
                            onChange={(e) => setEdited(e.target.value)}
                        ></textarea>
                        <button type={"submit"}>編集して再投稿</button>
                    </form>
                    <button onClick={DeleteMessage()}>メッセージを削除</button>
                    <button onClick={handleCloseButtonClick}>画面を閉じる</button>  
                </div>
                <div
                    className={`popup-menu ${detailShown ? 'shown' : ''}`}
                >
                    <div className="textbox">
                        {edited}
                    </div>
                    <button onClick={handleCloseButtonClick}>Close</button>  
                </div>
            </div> 
        </div>  
    );
};
export default Rand;
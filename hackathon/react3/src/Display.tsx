import { useState } from "react";
import React from "react";
import { User } from "firebase/auth";

type Props = {
    channel: string;
  };

const Display = (props: Props) => {
    type MessageInfo = {
        messageId: string,
        posted_at: string,
        user: string,
        message: string,
        edit: boolean;
    }
    type MessageInfos = {
        messageId: string,
        posted_at: string,
        user: string,
        message: string,
        edit: boolean
    }[];
    const defaultData: MessageInfos = [{
        messageId: '0',
        posted_at: '2023-06-04 12:00:00',
        user: 'hanako',
        message: 'Hello!',
        edit: false
    }]

    function editIf(bool: boolean) {
        if (bool) {
            return "(Edited)"
        }
        return ""
    }

    const [datalist, setDatalist] = useState(defaultData.map((data)=><h1 key={data["messageId"]}>{data["posted_at"]} {data["user"]} {data["message"]} {editIf(data["edit"])}</h1>));
    const channel = props.channel
    
    const fetchUsers = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response: Response = await fetch(
                `https://uttc-lnzf2ojmsq-uc.a.run.app/message?channel=${channel}`,
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
            setDatalist(info.map((data)=><button onClick={handleClick(data)} className="box_h"><h3 key={data["messageId"]}>{atob(data["posted_at"])} {data["user"]} {data["message"]} {editIf(data["edit"])}</h3></button>))
        } catch(err) {
            console.error(err);
        }
    }

    const [edited, setEdited] = useState("")
    const [id, setId] = useState("") //id of the edited message

    function handleClick(data: MessageInfo) {
        return function(event: React.MouseEvent<HTMLButtonElement>) {
            event.preventDefault();
            setIsShown(true);
            setEdited(data.message);
            setId(data.messageId);
        };
    }

    const [isShown, setIsShown] = useState(false)
      
    const handleCloseButtonClick = () => {        
        setIsShown(false)
    }

    const EditMessage = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsShown(false);
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
            setIsShown(false);
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
        <div className="App">
            <header>
                <h1>Message Log</h1>
            </header>
            <form onSubmit={fetchUsers}>
                <button type={"submit"}>Show</button>
            </form>
            <div className="popup-menu-container">
                <div className="list">
                    {datalist}
                </div>
                <div
                    className={`popup-menu ${isShown ? 'shown' : ''}`}
                >
                    <h1>Edit Message</h1>
                    <form onSubmit={EditMessage}>
                        <div>
                            <div className="box_i"><input
                                type={"text"}
                                value={edited}
                                onChange={(e) => setEdited(e.target.value)}
                            ></input></div>
                        </div>
                        <button type={"submit"}>Repost</button>
                    </form>
                    <button onClick={DeleteMessage()}>Delete</button>
                    <button onClick={handleCloseButtonClick}>Close</button>  
                </div>
            </div> 
        </div>  
    );
};
export default Display;

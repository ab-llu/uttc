import { useState } from "react";

const AddChannel = () => {
    const [isShown, setIsShown] = useState(false);
      
    const handleCloseButtonClick = () => {        
        setIsShown(false);
    };

    const PopUp = (event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            setIsShown(true);
            console.log("PopUp");
    
    };

    return (
        <div className="popup-menu-container">
            <button onClick={PopUp}>Add Channel</button>
            <div className={`popup-menu ${isShown ? 'shown' : ''}`}>
                <h1>Add Channel</h1>
                <button onClick={handleCloseButtonClick}>Close</button>
            </div>
        </div>  
    );
};

export default AddChannel;
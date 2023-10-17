import { useState } from "react";
import GameSettings from "./GameSettings";
import GamePage from "./GamePage";
  
export default function SettingsPage(){
  
  //state
    const [modalView, setModalView] = useState<boolean>(true);

    const handleCloseModal = () => {
        setModalView(false);
    }

  //behaviour

  //render

  
  return (
    <div>
        {modalView && <GameSettings onClose={handleCloseModal}/>}
    </div>
    );
};


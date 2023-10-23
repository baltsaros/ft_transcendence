import { useState } from "react";
import GameSettings from "../components/pong/GameSettings";
  
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


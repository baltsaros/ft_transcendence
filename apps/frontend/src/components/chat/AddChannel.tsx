import { useState } from "react";
import AddChannelModal from "./AddChannelModal";

function AddChannel () {

    // state
    const [modalView, setModalView] = useState(false);

    // behavior
    const handleOpenModal = () => {
        setModalView(true);
    }
    
    const handleCloseModal = () => {
        setModalView(false);
    }

    // render
    return (
    <div>
        <button className="bg-blue-500 text-white p-3 rounded-r-lg" onClick={handleOpenModal}>Add channel</button>
        {modalView &&
        <AddChannelModal onClose={handleCloseModal} />
        }
    </div>

    )

}

export default AddChannel;
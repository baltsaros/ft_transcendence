import { useState } from "react";
import AddChannelModal from "./AddChannelModal";

function AddChannel () {

    // state
    const [modalVis, setModalVis] = useState();

    // behavior
    const handleClick = () => {

        
    }

    // render
    return (
    <div>
        <button className="bg-blue-500 text-white p-3 rounded-r-lg" onClick={handleClick}>Add channel</button>
        <AddChannelModal />
    </div>

    )


}

export default AddChannel;
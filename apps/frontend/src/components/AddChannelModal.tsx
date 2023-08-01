import { useState } from "react";

interface ModalProp {
    onClose: () => void; // Define the type of onClose prop as a function that returns void & takes no arg
}


// function AddChannelModal ({onClose}) {
const AddChannelModal: React.FC<ModalProp> = ({onClose}) =>  {

    // state
    const [channelId, setChannelId] = useState('');

    // behavior
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChannelId(event.target.value);
    }
    
    const handleCancel = () => {
        onClose();
    }

    const handleOk = (event: React.ChangeEvent<HTMLInputElement>) => {
        


    }

    // render
    return (
        <div className="modal">
            <div className="modal-content text-black">
                <h2>Add Channel</h2>
                <input
                value={channelId}
                type="text"
                placeholder="Type the channel id..."
                onChange={handleChange}
                />
            </div>
            <button className="bg-blue-500 text-white p-3 rounded-r-lg" onClick={handleOk}>OK</button>
            <button className="bg-blue-500 text-white p-3 rounded-r-lg" onClick={handleCancel}>Cancel</button>
        </div>
    )
}

export default AddChannelModal;
import { useState } from "react";
import { instance } from "../api/axios.api";

interface ModalProp {
    onClose: () => void; // Define the type of onClose prop as a function that returns void & takes no arg
}


// function AddChannelModal ({onClose}) {
const AddChannelModal: React.FC<ModalProp> = ({onClose}) =>  {

    // state
    const [channelId, setChannelId] = useState('');
    // const [_message, setMessage] = useState('');

    // behavior
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChannelId(event.target.value);
    }
    
    const handleCancel = () => {
        onClose();
    }

    const handleOk = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        try{
            event.preventDefault();
            // instance.post('channels', channelId) // URL should be updated to /channels/addchannel
            const response = await instance.get<string>('channels');
            console.log(response);
            // setMessage(response);
        } catch (error) {
            console.log("Error adding channel:", error);
            // setMessage("Channel could not be added");
        }
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
            {/* <p>{message}</p> */}
        </div>
    )
}

export default AddChannelModal;
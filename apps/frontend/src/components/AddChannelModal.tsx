import { useState } from "react";
import { instance } from "../api/axios.api";
import { IAddChannelsData,  IResponseAddChannelData} from "../types/types"

interface ModalProp {
    onClose: () => void; // Define the type of onClose prop as a function that returns void & takes no arg
}

const AddChannelModal: React.FC<ModalProp> = ({onClose}) =>  {

    /* STATE */
    const [channelId, setChannelId] = useState('');

    /* BEHAVIOR */
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChannelId(event.target.value);
    }
    
    const handleCancel = () => {
        onClose();
    }

    const handleOk = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        try{
            event.preventDefault();
            const channelData: IAddChannelsData = {
                channelId: channelId,
            }
            const response = await instance.post('channels', channelData)
            console.log(response.data.message);
        } catch (error) {
            console.log("Error adding channel:", error);
        }
    }

    /* RENDERING */
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
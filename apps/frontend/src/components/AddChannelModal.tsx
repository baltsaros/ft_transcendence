import { useState } from "react";
import { instance } from "../api/axios.api";
import { IAddChannelsData} from "../types/types"
// import Cookies from "js-cookie";
import { useAppSelector } from "../store/hooks";
import { RootState } from "../store/store";

interface ModalProp {
    onClose: () => void; // Define the type of onClose prop as a function that returns void & takes no arg
}

const AddChannelModal: React.FC<ModalProp> = ({onClose}) =>  {

    /* STATE */
    const [channelName, setChannelName] = useState('');
    const [channelMode, setChannelMode] = useState('');
    const user = useAppSelector((state: RootState) => state.user.user);

    /* BEHAVIOR */
    const handleChannelName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChannelName(event.target.value);
    }
    
    const handleChannelMode = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChannelMode(event.target.value);
    }

    const handleCancel = () => {
        onClose();
    }

    const handleOk = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        try{
            event.preventDefault();
            const channelData: IAddChannelsData = {
                name: channelName,
                mode: channelMode,
                owner: user.username,
            }
            // const ret = await instance.get();
            console.log(channelData.name);
            const response = await instance.post('channels', channelData);
            console.log(response.data.message);
        } catch (error) {
            console.log("Error adding channel:", error);
        }
    }

    /* RENDERING */
    return (
        // <div className="modal">
        //     <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-opacity-50 bg-black">
        //         <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col">
        //             <div className="modal-content text-black">
        //                 <header className="text-2xl font-bold">
        //                     <h2>Add Channel</h2>
        //                     </header>
        //                     <div className="mb-4">
        //                         <div className="w-full mt-1 p-2 border rounded">
        //                             <input
        //                             value={channelName}
        //                             type="text"
        //                             placeholder="Type the channel name..."
        //                             onChange={handleChannelName}
        //                             />
        //                         </div>
        //                             <div>
        //                                 <input
        //                                 value={channelMode}
        //                                 type="text"
        //                                 placeholder="Type the channel mode..."
        //                                 onChange={handleChannelMode}
        //                                 />
        //                             </div>
        //                                 <div className="flex ">
        //                                     <button className="bg-blue-500 text-white p-3 rounded-r-lg mr-2" onClick={handleOk}>OK</button>
        //                                     <button className="bg-blue-500 text-white p-3 rounded-r-lg" onClick={handleCancel}>Cancel</button>
        //                                 </div>
        //                         </div>
        //             </div>
        //         </div>
        //     </div>
        // </div>
        
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-opacity-50 bg-black">
        <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col">
          {/* Modal content */}
          <h2 className="text-2xl font-bold mb-4">Add Channel</h2>
          {/* Inputs ordered vertically */}
          <div className="mb-4">
            <label htmlFor="channelName" className="block text-sm font-medium text-gray-700">
              Channel Name
            </label>
            <div className='text-black'>
            <input
              type="text"
              id="channelName"
              className="w-full mt-1 p-2 border rounded"
              placeholder="Enter channel name"
              onChange={handleChannelName}
              />
              </div>
          </div>
          <div className="mb-4">
            <label htmlFor="channelDescription" className="block text-sm font-medium text-gray-700">
              Channel Mode
            </label>
            <div className='text-black'>
            <input
              type="text"
              id="channelMode"
              className="w-full mt-1 p-2 border rounded"
              placeholder="Enter channel mode"
              onChange={handleChannelMode}
            />
          </div>
          </div>
          {/* Buttons */}
          <div className="flex justify-end">
            <button
              onClick={handleOk}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2">Ok
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      </div>

    )
}

export default AddChannelModal;
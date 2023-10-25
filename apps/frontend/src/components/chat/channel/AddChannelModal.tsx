import { useEffect, useState } from "react";
import { instance } from "../../../api/axios.api";
import { useAppSelector } from "../../../store/hooks";
import { RootState } from "../../../store/store";
import { IChannelData } from "../../../types/types";
import { toast } from "react-toastify"

interface ModalProp {
    onClose: () => void; // Define the type of onClose prop as a function that returns void & takes no arg
}

const AddChannelModal: React.FC<ModalProp> = ({onClose}) =>  {
  
  const user = useAppSelector((state: RootState) => state.user.user);
  
  /* STATE */
    const [channelName, setChannelName] = useState('');
    const [channelMode, setChannelMode] = useState('');
    const [isProtected, setIsProtected] = useState(false);
    const [channelPassword, setChannelPassword] = useState('');

    /* BEHAVIOR */
    // 1. Check if the channel dm exists (user - receiver user_channel search by channel name)
    // 2. Channel creation method
    const handleChannelName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChannelName(event.target.value);
    }
    
    const handleChannelMode = (event: React.ChangeEvent<HTMLInputElement>) => {
      const mode = event.target.value;
      setChannelMode(mode);
      setIsProtected(mode === 'Protected');
    }

    const handleChannelPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
      setChannelPassword(event.target.value);
    }

    const handleCancel = () => {
      onClose();
    }

    const handleFormCheck = () => {
      if (channelName.length === 0 || channelMode.length === 0 || (channelMode === 'Protected' && channelPassword.length === 0))
        return false;
      return true;
    }

    /* By dispatching the setChannels action to the Redux store, the associated reducer function will be called to update the state managed by the "channel" slice. */
    const handleChannelCreation = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        try{
          if (handleFormCheck())
          {
            const channelData: IChannelData = {
                name: channelName,
                mode: channelMode,
                owner: user!,
                password: channelPassword,
            }
            const newChannel = await instance.post('channel', channelData);
            if (newChannel) {
              toast.success("Channel successfully added!");
            }
          }
          else
            toast.error("Enter a value");
        } catch (error: any) {
            const err = error.response?.data.message;
            toast.error(err.toString());
        }
        onClose();
    }

    /* RENDERING */
    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-opacity-50 bg-black z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col">
          <h2 className="text-2xl font-bold mb-4">Add Channel</h2>
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
            <div className="flex flex-col text-black">
              <div className="flex items-center">
                <input
                className="mr2"
                type="radio" 
                value="Public"
                name="Mode"
                /* The checked attribute determines whether the radio button is selected or not
                ** It is set to true when the state matches the value "Public"
                */
                checked={channelMode === "Public"}
                /* onChange event handler updates the value of the state*/
                onChange={handleChannelMode}
                />Public
             </div>
            <div className="flex items-center">
             <input
             className="mr2"
             type="radio"
             value="Private"
             name="Mode"
             checked={channelMode === "Private"}
             onChange={handleChannelMode}
             />Private
            </div>
            <div className="flex items-center">
             <input
             className="mr2"
             type="radio"
             value="Protected"
             name="Mode"
             checked={channelMode === "Protected"}
             onChange={handleChannelMode}
             />Protected
            </div>
            <div>
              {isProtected &&
              <input
              type="password"
              id="channelPassword"
              className="w-full mt-1 p-2 border rounded"
              placeholder="Enter channel password"
              onChange={handleChannelPassword}
              />
              }
            </div>
          </div>
        </div>
          {/* Buttons */}
          <div className="flex justify-end">
            <button
              onClick={handleChannelCreation}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2">Ok
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      </div>

    )
}

export default AddChannelModal;
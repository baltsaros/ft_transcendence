import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { instance } from "../../api/axios.api";
import { useAppSelector } from "../../store/hooks";
import { RootState } from "../../store/store";
import { addChannel } from "../../store/channel/channelSlice";
import { IChannelData, IResponseChannelData } from "../../types/types";
import { store } from "../../store/store"
import { toast } from "react-toastify"

interface ModalProp {
    onClose: () => void; // Define the type of onClose prop as a function that returns void & takes no arg
}

const AddChannelModal: React.FC<ModalProp> = ({onClose}) =>  {

    /* STATE */
    const [channelName, setChannelName] = useState('');
    const [channelMode, setChannelMode] = useState('');
    const [isProtected, setIsProtected] = useState(false);
    const [newChannel, setChannel] = useState<IResponseChannelData | undefined>(undefined);
    const [channelPassword, setChannelPassword] = useState('');
    const user = useAppSelector((state: RootState) => state.user.user);
    const dispatch = useDispatch();

    /* BEHAVIOR */
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
      console.log('store state:', store.getState());
      onClose();
    }

    /* By dispatching the setChannels action to the Redux store, the associated reducer function will be called to update the state managed by the "channel" slice. */
    const handleOk = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        try{
            event.preventDefault();
            const channelData: IChannelData = {
                name: channelName,
                mode: channelMode,
                owner: user!,
                password: channelPassword,
            }
            const newChannel = await instance.post('channel', channelData);
            setChannel(newChannel.data);
            // const newChannelId = newChannel.data.id;
            const result = store.dispatch(addChannel(newChannel.data));
            console.log('store state:', store.getState());
            console.log('result: ', result);
            if (result) {
              toast.success("Channel successfully added!");
            }
            // dispatch(setChannels([newChannelId]));
        } catch (error: any) {
            const err = error.response?.data.message;
            toast.error(err.toString());
        }
        onClose();
    }

    /* RENDERING */
    return (
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
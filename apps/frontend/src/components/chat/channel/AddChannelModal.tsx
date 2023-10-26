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
    const [isChannelNameFilled, setIsChannelNameFilled] = useState<boolean>(false);
    const [isPasswordFilled, setIsPasswordFilled] = useState<boolean>(true);

    /* BEHAVIOR */
    // 1. Check if the channel dm exists (user - receiver user_channel search by channel name)
    // 2. Channel creation method
    const handleChannelName = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.value != '')
			setIsPasswordFilled(true);
		else
			setIsPasswordFilled(false);
		setChannelName(event.target.value);
    }

    const handleChannelMode = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const mode = event.target.value;
		setChannelMode(mode);
		setIsProtected(mode === 'Protected');
    }

    const handleChannelPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.value != '')
			setIsChannelNameFilled(true);
		else
			setIsChannelNameFilled(false);
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
  <div className="bg-gray-400 p-8 rounded-lg shadow-lg flex flex-col">
    <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Create Channel</h2>
    <div className="mb-4">
      <label htmlFor="channelName" className="block text-sm font-medium text-gray-700">
        Channel Name
      </label>
      <input
        type="text"
        id="channelName"
        className="w-full mt-1 p-2 border rounded text-gray-800 focus:outline-none focus:border-blue-500"
        placeholder="Enter channel name"
        onChange={handleChannelName}
      />
    </div>
    <div className="mb-4">
      <label htmlFor="channelMode" className="block text-sm font-medium text-gray-700">
        Channel Mode
      </label>
      <select
        id="channelMode"
        className="w-full mt-1 p-2 border rounded text-gray-800 focus:outline-none focus:border-blue-500"
        onChange={handleChannelMode}
        value={channelMode}
      >
        <option value="">Select mode</option>
        <option value="Public">Public</option>
        <option value="Private">Private</option>
        <option value="Protected">Protected</option>
      </select>
    </div>
    {channelMode === "Protected" && (
      <div className="mb-4">
        <label htmlFor="channelPassword" className="block text-sm font-medium text-gray-700">
          Channel Password
        </label>
        <input
          type="password"
          id="channelPassword"
          className="w-full mt-1 p-2 border rounded text-gray-800 focus:outline-none focus:border-blue-500"
          placeholder="Enter channel password"
          onChange={handleChannelPassword}
        />
      </div>
    )}
    {/* Button */}
    <div className="flex justify-between">
      <button
        onClick={handleCancel}
        className="bg-red-500 text-white px-4 py-2 rounded-lg ml-auto hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
      >
        Cancel
      </button>
      <button
        onClick={handleChannelCreation}
        className={`${
          (channelMode && isChannelNameFilled && isPasswordFilled) ? "bg-green-500 hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300" : "bg-gray-300 cursor-not-allowed"
        } text-white px-4 py-2 rounded-lg ml-auto`}
        disabled={!channelMode || !isChannelNameFilled || !isPasswordFilled}
      >
        Ok
      </button>
    </div>
  </div>
</div>





    )
}

export default AddChannelModal;
import { useState } from "react";
import { IChannel } from "../../../types/types";
import { ChannelService } from "../../../services/channels.service";
import bcrypt from "bcryptjs";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { useChatWebSocket } from "../../../context/chat.websocket.context";

interface ModalProp {
    onClose: () => void;
    channel: IChannel;
  }

const JoinPvtChannelModal: React.FC<ModalProp> = ({ onClose, channel }) => {

    const [password, setPassword] = useState<string>('');
    const userLogged = useSelector((state: RootState) => state.user);
    const webSocketService = useChatWebSocket();

const handleCancel = () => {
    console.log('cancel');
    onClose();
}

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    console.log('submit');
    // Add your logic for handling form submission here
  }

  const handleChannelPassword = (channel: IChannel) => async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("channel", channel);
    console.log("password", password);
    try {
      const data = await ChannelService.getHashedPassword(channel.id);
      const isMatch = bcrypt.compareSync(password, data.hashed);
      setPassword("");
      if (!isMatch) toast.error("Incorrect password! Try again.");
      else {
        toast.success("Access granted!");
        const payload = {
          channelId: channel.id,
          username: userLogged.username,
        };
        if (webSocketService) webSocketService.emit("onChannelJoin", payload);
      }
    } catch (err: any) {
      console.log("join channel failed");
    }
  };

    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-opacity-50 bg-black z-50">
          <div className="bg-gray-400 p-8 rounded-lg shadow-lg flex flex-col">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
              Enter Password
            </h2>
            <div className="mb-4">
              <input
                type="password"
                id="password"
                className="w-full mt-1 p-2 border rounded text-gray-800 focus:outline-none focus:border-blue-500"
                placeholder="Enter password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleCancel}
                className="bg-red-500 text-white px-4 py-2 rounded-lg ml-auto hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
              >
                Cancel
              </button>
              <form onSubmit={handleChannelPassword(channel)}>
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg ml-auto hover:bg-red-600 focus:outline-none focus:ring focus:ring-green-300">
                  Ok
                </button>
              </form>
            </div>
          </div>
        </div>
      );
};

export default JoinPvtChannelModal;
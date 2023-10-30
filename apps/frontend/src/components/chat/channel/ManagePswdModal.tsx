import { useState } from "react";
import { useAppSelector } from "../../../store/hooks";
import { RootState } from "../../../store/store";
import { IChannel } from "../../../types/types";
import { toast } from "react-toastify";
import { ChannelService } from "../../../services/channels.service";
import bcrypt from "bcryptjs";
import { useNavigate } from "react-router-dom";

interface ModalProp {
  onClose: () => void;
  channel: IChannel;
}

const ManagePswdModal: React.FC<ModalProp> = ({ onClose, channel }) => {
  const user = useAppSelector((state: RootState) => state.user.user);

  /* STATE */
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const navigate = useNavigate();

  /* BEHAVIOR */
  const handleOldPassword = async () => {
    if (oldPassword != "") {
      try {
        const data = await ChannelService.getHashedPassword(channel.id);
        const isMatch = bcrypt.compareSync(oldPassword, data.hashed);
        setOldPassword("");
        if (!isMatch) {
          toast.error("Old password is incorrect! Try again.");
          return false;
        } else {
          toast.success("Old password was accepted!");
          return true;
        }
      } catch (err: any) {
        console.log("join channel failed");
        return false;
      }
    } else return false;
  };

  const handleNewPassword = async () => {
    if (password != "") {
      const hashed = bcrypt.hashSync(password, bcrypt.genSaltSync());
      setPassword(hashed);
      return { filled: true, pass: hashed };
    } else return { filled: false, pass: "" };
  };

  const handleCancel = async () => {
    onClose();
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const oldPass = await handleOldPassword();
    const newPass = await handleNewPassword();
    const payload = {
      channelId: channel.id,
      password: newPass.pass,
    };
    if (oldPass && newPass.filled) {
      const data = await ChannelService.setPasswordToChannel(payload);
      if (data) {
        toast.success("Password has been successfuly changed!");
        navigate("/chat");
        window.location.reload();
      } else toast.error("Something went wrong!");
    }
    else if (!newPass.filled) toast.error("New password is empty!");
  };

  /* RENDERING */
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-opacity-50 bg-black z-50">
      <div className="bg-gray-400 p-8 rounded-lg shadow-lg flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Set Password
        </h2>
        <div className="mb-4">
          {channel.mode === "Private" && (
            <div>
              <label
                htmlFor="channelName"
                className="block text-sm font-medium text-gray-700"
              >
                Old Password
              </label>
              <input
                type="password"
                id="oldPassword"
                className="w-full mt-1 p-2 border rounded text-gray-800 focus:outline-none focus:border-blue-500"
                placeholder="Old password"
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="channelName"
            className="block text-sm font-medium text-gray-700"
          >
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            className="w-full mt-1 p-2 border rounded text-gray-800 focus:outline-none focus:border-blue-500"
            placeholder="New password"
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
          <form onSubmit={handleSubmit}>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg ml-auto hover:bg-red-600 focus:outline-none focus:ring focus:ring-green-300">
              Ok
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManagePswdModal;

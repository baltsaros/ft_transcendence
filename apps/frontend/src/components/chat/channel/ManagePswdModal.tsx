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
  const [isPasswordFilled, setIsPasswordFilled] = useState<boolean>(false);
  const [oldPassword, setOldPassword] = useState("");
  const [isOldPasswordFilled, setIsOldPasswordFilled] =
    useState<boolean>(false);
  const navigate = useNavigate();

  /* BEHAVIOR */
  const handleOldPassword = async () => {
    if (oldPassword != "") {
      try {
        const data = await ChannelService.getHashedPassword(channel.id);
        const isMatch = bcrypt.compareSync(oldPassword, data.hashed);
        console.log("oldPass for " + channel.name);
        setOldPassword("");
        if (!isMatch) {
          toast.error("Old password is incorrect! Try again.");
          setIsOldPasswordFilled(false);
        } else {
          toast.success("Old password was accepted!");
          setIsOldPasswordFilled(true);
        }
      } catch (err: any) {
        console.log("join channel failed");
      }
    } else setIsOldPasswordFilled(false);
  };

  const handleNewPassword = async () => {
    if (password != "") {
      const hashed = bcrypt.hashSync(password, bcrypt.genSaltSync());
      setPassword(hashed);
      setIsPasswordFilled(true);
      console.log("new pass: " + password);
    } else setIsPasswordFilled(false);
  };

  const handleCancel = async () => {
    onClose();
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // event.preventDefault();
    await handleOldPassword();
    await handleNewPassword();
    const payload = {
      idChannel: channel.id,
      password: password,
    };
    if (isOldPasswordFilled && isPasswordFilled) {
      const data = await ChannelService.setPasswordToChannel(payload);
      if (data) {
        toast.success("Password has been successfuly changed!");
        setIsOldPasswordFilled(false);
        setIsPasswordFilled(false);
        navigate("/chat");
      } else toast.error("Something went wrong!");
    }
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

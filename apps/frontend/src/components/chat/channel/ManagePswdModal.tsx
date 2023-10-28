import { useEffect, useState } from "react";
import { instance } from "../../../api/axios.api";
import { useAppSelector } from "../../../store/hooks";
import { RootState } from "../../../store/store";
import { IChannel, IChannelData } from "../../../types/types";
import { toast } from "react-toastify";
import axios from "axios";
import { ChannelService } from "../../../services/channels.service";
import bcrypt from "bcryptjs";

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

  /* BEHAVIOR */
  const handleOldPassword = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.value != "") {
      setOldPassword(event.target.value);
      try {
        const data = await ChannelService.getHashedPassword(channel.id);
        const isMatch = bcrypt.compareSync(oldPassword, data.hashed);
        setOldPassword("");
        if (!isMatch) {
          toast.error("Incorrect password! Try again.");
          setIsOldPasswordFilled(false);
        } else {
          toast.success("DONE!");
          setIsOldPasswordFilled(true);
        }
      } catch (err: any) {
        console.log("join channel failed");
      }
    } else setIsOldPasswordFilled(false);
  };

  const handleNewPassword = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.value != "") {
      const hashed = bcrypt.hashSync(event.target.value, bcrypt.genSaltSync());
      setPassword(hashed);
      setIsPasswordFilled(true);
    } else {
      setIsPasswordFilled(false);
    }
  };

  const handleCancel = async () => {
    onClose();
  };
  const handleSubmit = async () => {
    const payload = {
      idChannel: channel.id,
      password: password,
    };
    ChannelService.setPasswordToChannel(payload);
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
                onChange={handleOldPassword}
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
            onChange={handleNewPassword}
          />
        </div>
        <div className="flex justify-between">
          <button
            onClick={handleCancel}
            className="bg-red-500 text-white px-4 py-2 rounded-lg ml-auto hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded-lg ml-auto hover:bg-red-600 focus:outline-none focus:ring focus:ring-green-300"
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagePswdModal;

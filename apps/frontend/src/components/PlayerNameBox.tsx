import { useSelector } from "react-redux";
import { AuthService } from "../services/auth.service";
import { PlayerService } from "../services/player.service";
import { RootState } from "../store/store";
import { IUserPlayerProfileData } from "../types/types";

export default function PlayerNameBox(user: IUserPlayerProfileData) {

    //state
    const blocked = useSelector((state: RootState) => state.blocked.users);
    const userLogged = useSelector((state: RootState) => state.user.user);

    //behaviour
    const handleBlockUser = async () => {
      const userToBlock = await AuthService.getProfile();
      if (userToBlock) {
        const payload = {
          senderId: userLogged!.id,
          receiverId: userToBlock.id
        };
        await PlayerService.blockUser(payload);
      }
    };
    const handleUnblockUser = async () => {
      const payload = {
        senderId: userLogged!.id,
        receiverId: user.id,
      };
      await PlayerService.unblockUser(payload);
    };


    //render
    return (
      <div className="w-96 text-2xl p-4 gap-4 rounded-lg shadow-lg bg-gray-400 from-blue-400 to-purple-500 mt-10">
				<div>
          <p className="bg-gray-600 mt-2 rounded-lg p-2 gap-2 text-white">{user.username}'s profile</p>
        </div>
			  <div className="grid grid-cols-2 text-base gap-2">
				  <button className="rounded-lg bg-blue-600 p-2 mt-2 text-white shadow-md">Send friend request</button>
				  <button className="rounded-lg bg-red-600 p-2 mt-2 text-white shadow-md">Block user</button>
			  </div>
		  </div>
    );
}

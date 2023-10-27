import { IUserUsername } from "../types/types";
import Cookies from "js-cookie";
import { PlayerService } from "../services/player.service";
import { MenuItem } from "@szhsin/react-menu";
import { toast } from "react-toastify";
import { RootState, store } from "../store/store";
import { addFriend } from "../store/user/friendsSlice";
import { removeInvitation } from "../store/user/invitationSlice";
import { useSelector } from "react-redux";

export default function FriendInvitations(invitation: IUserUsername) {

    const users = useSelector((state: RootState) => state.allUser.users);
    const userConnected = useSelector((state: RootState) => state.user.user);

    const acceptInvitation = async (invitation: string) => {
       try {
            const username = Cookies.get("username");
            if (username) {
                const receiverId = await PlayerService.getInfoUser(username);
                if (!receiverId)
                    return toast.error("User doesn't exists !");
                const senderId = await PlayerService.getInfoUser(invitation);
                if (!senderId)
                    return toast.error("User doesn't exists !");
                if (await PlayerService.acceptInvitation({receiverId, senderId}))
                {
                    const sender = users.filter((elem) => elem.id === senderId)[0];
                    const senderUserUsername: IUserUsername = {
                        username: sender.username,
                        status: sender.status,
                    };
                    console.log(senderUserUsername);
                    store.dispatch(removeInvitation(senderUserUsername));
                    toast.success("player added as friend");
                }
            }   
        } catch (err: any) {
        }}
        
        const refuseInvitation = async (invitation: string) => {
            try {
                const username = Cookies.get("username");
                if (username)
                {
                    const receiverId = await PlayerService.getInfoUser(username);
                    if (!receiverId)
                    return toast.error("User doesn't exists !");
                    const senderId = await PlayerService.getInfoUser(invitation);
                    if (!senderId)
                    return toast.error("Friend to remove doesn't exist !");
                    await PlayerService.refuseInvitation({receiverId, senderId});
                    const sender = users.filter((elem) => elem.id === senderId)[0];
                    const senderUserUsername: IUserUsername = {
                        username: sender.username,
                        status: sender.status,
                    };
                    store.dispatch(removeInvitation(senderUserUsername));
            }
        } catch (err: any) {
        }
    }
    
      //render

    return (
        <MenuItem key={invitation.username} disabled className="text-black text-sm" >
                <div className="grid grid-cols-4 gap-4">
                    <div className="text-left py-1 col-span-2">
                        {invitation.username}
                    </div>
                    <div className="col-start-3">
                        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 border border-green-700 rounded"
                            onClick={() => acceptInvitation(invitation.username)}>
                            V
                        </button>
                    </div>
                    <div className="col-start-4">
                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 border border-red-700 rounded"
                            onClick={() => refuseInvitation(invitation.username)}>
                            X
                        </button>
                    </div>
                </div> 
            </MenuItem>
        )
}

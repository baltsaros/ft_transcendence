import { useEffect, useState } from "react";
import { IUserUsername } from "../types/types";
import Cookies from "js-cookie";
import { PlayerService } from "../services/player.service";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import { toast } from "react-toastify";
import { FaUserFriends } from "react-icons/fa";

export default function FriendInvitations() {

    const [invitations, setInvitations] = useState<IUserUsername[]>(
        [
          { username: 'Juan', status: 'online'}
        ]
      );

    const acceptInvitation = async (invitation: string) => {
       try {
            const username = Cookies.get("username");
            if (username) {
                const receiverId = await PlayerService.getInfoUser(username);
                if (receiverId)
                {
                    const senderId = await PlayerService.getInfoUser(invitation);
                    if (senderId)
                    {
                        const ret = await PlayerService.acceptInvitation({receiverId, senderId});
                    }
                }
            }
            
        } catch (err: any) {}}
        
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
                const data =  await PlayerService.refuseInvitation({receiverId, senderId});
            }
        } catch (err: any) {
          const error = err.response?.data.message;
        }
    }
    
  
    useEffect(() =>  {
        const getAllFriendsInvitations = async () => {
            try {
                const username = Cookies.get("username");
                if (username) {
                    const id = await PlayerService.getInfoUser(username);
                    if (id)
                    {
                        const invit = await PlayerService.getAllInvitations(id);
                        if (invit) setInvitations(invit);
                    }
                }
            } catch (err: any) {}}
            getAllFriendsInvitations();
        }, [invitations])
  
      //render

        if (invitations.length)
            return (
                <Menu direction={"bottom"} arrow={true} menuButton={<MenuButton ><FaUserFriends /></MenuButton>}>
                {invitations.map((invitation) => (
                    <MenuItem key={invitation.username} disabled className="text-black" >
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
        
                ))}
                </Menu>
            )
        return (
            <div>
                <Menu direction={"bottom"} arrow={true} menuButton={<MenuButton ><FaUserFriends /></MenuButton>}>
                    <MenuItem disabled >No pending invitations</MenuItem>
                </Menu>
            </div>
        )
}

import Cookies from "js-cookie";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useChatWebSocket } from "../context/chat.websocket.context";
import { AuthService } from "../services/auth.service";
import { PlayerService } from "../services/player.service";
import { addBlocked, removeBlocked } from "../store/blocked/blockedSlice";
import { RootState, store } from "../store/store";
import { addFriend, removeFriend } from "../store/user/friendsSlice";
import { addInvitation } from "../store/user/invitationSlice";
import { IResponseUser, IUserPlayerProfileData, IUserUsername } from "../types/types";

export default function PlayerNameBox(user: IResponseUser) {

    //state
    const blocked = useSelector((state: RootState) => state.blocked.users);
    const userLogged = useSelector((state: RootState) => state.user.user);
    const invitations = useSelector((state: RootState) => state.invitation.invitations);
    const friends = useSelector((state: RootState) => state.friend.friends);
    const webSocketService = useChatWebSocket();


    const isBlocked = () => {
      return blocked.some((item) => item.username === user.username);
    };
  
    // const isInvited = () => {
    //   return invitations.some((item) => item.username === user.username);
    // };

    const isFriend = () => {
      return friends.some((item) => item.username === user.username);
    };
  

    //behaviour
    const handleBlockUser = async () => {
        const payload = {
          senderId: userLogged!.id,
          receiverId: user.id
        };
        await PlayerService.blockUser(payload);
    };
    const handleUnblockUser = async () => {
      const payload = {
        senderId: userLogged!.id,
        receiverId: user.id,
      };
      await PlayerService.unblockUser(payload);
    };

    const handleAddInvitation = async () => {
      const payload = {
      senderId: userLogged!.id,
      receiverId: user.id,
    };
    const ret = await PlayerService.sendInvitation(payload);
    if (!ret){
      toast.error("something went wrong with invitation");
      return;
    }
    if (ret.data === 2)
      return (toast.error("Invitation already sent!"))
    toast.success("Invitation sent !");
  }

  const deleteFriend = async () => {
      const payload = {
        receiverId: userLogged!.id,
        senderId: user.id,
      }
        const data =  await PlayerService.removeFriend(payload);
        if (data)
        {
            const senderUserUsername: IUserUsername = {
                username: user.username,
                status: user.status,
            };
            store.dispatch(removeFriend(senderUserUsername));
            toast.success("friend successfully deleted");
        }
  }

    useEffect(() => {
      webSocketService!.on("userBlockedPlayer", (payload: any) => {
          store.dispatch(addBlocked(payload));
      });
      webSocketService!.on("userUnblockedPlayer", (payload: any) => {
        store.dispatch(removeBlocked(payload));
      });
      return () => {
          webSocketService!.off('userBlockedPlayer');
          webSocketService!.off('userUnblockedPlayer');
              };
  }, []);


    //render
    return (
      <div className="w-96 text-2xl p-4 gap-4 rounded-lg shadow-lg bg-gray-400 from-blue-400 to-purple-500 mt-10">
				<div>
          <p className="bg-gray-600 mt-2 rounded-lg p-2 gap-2 text-white">{user.username}'s profile</p>
        </div>
          {userLogged?.username !== user.username &&
            <div className="grid grid-cols-2 text-base gap-2">
              {(!isFriend()) &&
                <button onClick={handleAddInvitation} className="rounded-lg bg-blue-600 p-2 mt-2 text-white shadow-md">Send friend request</button>
              }
              {isFriend() &&
                <button onClick={deleteFriend} className="rounded-lg bg-blue-600 p-2 mt-2 text-white shadow-md">Remove friend</button>
              }
              {/* {(!isFriend() && isInvited()) &&
                <button disabled className="rounded-lg bg-blue-600 p-2 mt-2 text-white shadow-md">Invitation sent</button>
              } */}
              {!isBlocked() &&
                <button onClick={handleBlockUser} className="rounded-lg bg-red-600 p-2 mt-2 text-white shadow-md">Block user</button>}
              {isBlocked() &&
                <button onClick={handleUnblockUser} className="rounded-lg bg-red-600 p-2 mt-2 text-white shadow-md">Unblock user</button>}
            </div>
          }
		  </div>
    );
}

import { useEffect } from "react";
import { IUserUsername } from "../types/types";
import ToggleMenuFriendList from "./ToggleMenuFriendList";
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import { Menu, MenuButton, MenuHeader, MenuItem } from '@szhsin/react-menu';
import FriendInvitations from "./FriendInvitations";
import { FaUserFriends } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState, store } from "../store/store";
import { addInvitation, fetchInvitations, removeInvitation } from "../store/user/invitationSlice";
import { addFriend, fetchFriends, removeFriend } from "../store/user/friendsSlice";
import { fetchAllUsers } from "../store/user/allUsersSlice";
import { useChatWebSocket } from "../context/chat.websocket.context";


function FriendList() {

    //state
  const invitationList = useSelector((state: RootState) => state.invitation.invitations);
  const friendList = useSelector((state: RootState) => state.friend.friends);
  const userConnected = useSelector((state: RootState) => state.user.user);
  const isOnline = (value: IUserUsername) => value.status === 'online';
  const isOffline = (value: IUserUsername) => value.status === 'offline';
  const isIngame = (value: IUserUsername) => value.status === 'inGame';
  const webSocketService = useChatWebSocket();

  useEffect(() => {
    if (userConnected)
    {
      store.dispatch(fetchInvitations(userConnected.username));
      store.dispatch(fetchFriends(userConnected.username));
      store.dispatch(fetchAllUsers());
    }
}, []);

  useEffect(() => {
      webSocketService!.on("requestRemoveFriend", (payload: any) => {
        store.dispatch(removeFriend(payload));
      });
      webSocketService!.on("requestAddInvitation", (payload: any) => {
        store.dispatch(addInvitation(payload));
      });
      webSocketService!.on("requestAddFriend", (payload: any) => {
        store.dispatch(addFriend(payload));
      });
  }, []);

  //render
  return (
    <div className="py-2 z-50">
      <Menu direction={"bottom"} arrow={true} align={"center"} menuButton={<MenuButton className="text-lg"><FaUserFriends /></MenuButton>}>
        <div className="bg-green-500 text-lg">
          <MenuHeader className="text-white">Online</MenuHeader>
        </div>
        {Object.values(friendList).filter(isOnline).length > 0 && friendList.map((friend) => (
          friend.status ==="online" && <div className="bg-gray-500" key={friend.username}>
              <ToggleMenuFriendList {...friend} />
              </div>              
        ))}
        {!Object.values(friendList).filter(isOnline).length && 
          <div className="bg-gray-500 flex items-center justify-center text-sm">
            <MenuItem className="" disabled >No friends online</MenuItem>
          </div>
        }
        <div className="bg-red-500 text-lg">
        <MenuHeader className="text-white">Offline</MenuHeader>
        </div>
        {Object.values(friendList).filter(isOffline).length > 0 && friendList.map((friend) => (
          friend.status ==="offline" && 
            <div className="bg-gray-500" key={friend.username}>
              <ToggleMenuFriendList {...friend} />
            </div>              
        ))}
        {!Object.values(friendList).filter(isOffline).length && 
          <div className="bg-gray-500 flex items-center justify-center text-sm">
            <MenuItem className="" disabled >No friends offline</MenuItem>
          </div>
        }
        <div className="bg-orange-500 text-lg">
        <MenuHeader className="text-white">In Game</MenuHeader>
        </div>
        {Object.values(friendList).filter(isIngame).length > 0 && friendList.map((friend) => (
          isIngame(friend) && 
            <div className="bg-gray-500" key={friend.username}>
              <ToggleMenuFriendList {...friend} />
            </div>              
        ))}
        {!Object.values(friendList).filter(isIngame).length && 
          <div className="bg-gray-500 flex items-center justify-center text-sm">
            <MenuItem className="" disabled >No friends in game</MenuItem>
          </div>
        }
        <div className="bg-blue-500 text-lg">
          <MenuHeader className="text-white">Invitations : {invitationList.length} </MenuHeader>
          <div className="bg-gray-500">
            {invitationList.length > 0 && invitationList.map((invitation) => (
             <FriendInvitations key={invitation.username} {...invitation} />
            ))}
            </div >
            {!invitationList.length &&
              <div className=" bg-gray-500 flex items-center justify-center text-sm">
                <MenuItem disabled >No pending invitations</MenuItem>
              </div>
            }
        </div>
      </Menu>
    </div>
  )
}
export default FriendList;
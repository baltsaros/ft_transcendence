import { useEffect, useState } from "react";
import { PlayerService } from "../services/player.service";
import { IUserUsername } from "../types/types";
import Cookies from "js-cookie";
import ToggleMenuFriendList from "./ToggleMenuFriendList";
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import { Menu, MenuButton, MenuHeader, MenuItem } from '@szhsin/react-menu';
import { toast } from "react-toastify";
import FriendInvitations from "./FriendInvitations";
import { FaUserFriends } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState, store } from "../store/store";
import { addInvitation, fetchFriends, fetchInvitation } from "../store/user/userSlice";


function FriendList() {

    //state
  const invitationList = useSelector((state: RootState) => state.user.invitations);
  const friendList = useSelector((state: RootState) => state.user.friends);

  const isOnline = (value: IUserUsername) => value.status === 'online';
  const isOffline = (value: IUserUsername) => value.status === 'offline';

  useEffect(() => {
    store.dispatch(fetchInvitation());
    store.dispatch(fetchFriends());
      }, []);

  //render
  return (
    <div className="py-2 ">
      <Menu direction={"bottom"} arrow={true} align={"center"} menuButton={<MenuButton className="text-lg"><FaUserFriends /></MenuButton>}>
        <div className="bg-green-500 text-lg">
          <MenuHeader className="text-white">Online</MenuHeader>
        </div>
        {friendList.filter(isOnline).length > 0 && friendList.map((friend) => (
          friend.status ==="online" && <div className="bg-gray-500" key={friend.username}>
              <ToggleMenuFriendList {...friend} />
              </div>              
        ))}
        {!friendList.filter(isOnline).length && 
          <div className="bg-gray-500 flex items-center justify-center text-sm">
            <MenuItem className="" disabled >No friends online</MenuItem>
          </div>
        }
        <div className="bg-red-500 text-lg">
        <MenuHeader className="text-white">Offline</MenuHeader>
        </div>
        {friendList.filter(isOffline).length > 0 && friendList.map((friend) => (
          friend.status ==="offline" && 
            <div className="bg-gray-500" key={friend.username}>
              <ToggleMenuFriendList {...friend} />
            </div>              
        ))}
        {!friendList.filter(isOffline).length && 
          <div className="bg-gray-500 flex items-center justify-center text-sm">
            <MenuItem className="" disabled >No friends offline</MenuItem>
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
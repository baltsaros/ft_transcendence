
// import { fetchFriends, fetchInvitation } from "../store/user/userSlice";

import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { IResponseUser, IUser, IUserUsername } from "../../../types/types";
import PlayerMenu from "./PlayerMenu";


function AdminMenu(user: IResponseUser) {

    //state
    const friends = useSelector((state: RootState) => state.friend.friends);

    const isFriend = (username: string) => {
      return (friends.some(item => item.username === username));
    }

    // const handleViewProfile(user : IResponseUser) {

    // }

  //render
  return (
    <div>
    <div className="text-black bg-blue-500 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none">
      <Menu direction={"left"} arrow={true} align={"center"} menuButton={<MenuButton className="w-24">{user.username}</MenuButton>}>
        <div className="bg-gray-500">
            {isFriend(user.username) && <MenuItem disabled>Invite as Friend</MenuItem>}
            {!isFriend(user.username) && <MenuItem>Invite as Friend</MenuItem>}
            <MenuItem>View Profile</MenuItem>
            <MenuItem>Direct Message</MenuItem>
            {(user.status === "offline" || user.status === "inGame") && 
              <MenuItem disabled>Invite to game</MenuItem>}
              {user.status === "online" && 
              <MenuItem>Invite to game</MenuItem>}
        </div>
      </Menu>
    </div>
    </div>
  )
}
export default AdminMenu;
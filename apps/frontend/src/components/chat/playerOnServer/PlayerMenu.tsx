
// import { fetchFriends, fetchInvitation } from "../store/user/userSlice";

import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { IResponseUser, IUser, IUserUsername } from "../../../types/types";


function PlayerMenu(user: IResponseUser) {

    //state



  //render
  return (
    <div className="text-black bg-blue-500 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none">
      <Menu direction={"left"} arrow={true} align={"center"} menuButton={<MenuButton className="text-base w-24">{user.username}</MenuButton>}>
        <div className="bg-gray-500">
            <MenuItem>Invite as Friend</MenuItem>
            <MenuItem>View Profile</MenuItem>
            <MenuItem>Direct Message</MenuItem>
            {user.status === "offline" || user.status === "inGame" && 
              <MenuItem disabled>Invite to game</MenuItem>}
        </div>
      </Menu>
    </div>
  )
}
export default PlayerMenu;
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import { Menu, MenuButton, MenuHeader, MenuItem } from '@szhsin/react-menu';
import { NavLink } from 'react-router-dom';
import { IUserUsername } from '../types/types';



function FriendList({username}: any) {

    //state

  //render
  return (
    <div className="py-2 ">
      <Menu direction={"bottom"} arrow={true} align={"center"} menuButton={ <MenuButton className={"py-2 text-white/50 hover:text-white"}>{username}</MenuButton>}>
            <MenuHeader className={"bg-gray-500 py-2 text-white hover:bg-gray-400"}>
                <MenuItem>
                    <NavLink
                        to={"player/" + username}
                        className={({ isActive }) =>
                          isActive
                            ? "py-2 text-white"
                            : "text-white/50 hover:text-white"
                        }>
                        Statistics
                    </NavLink>
                </MenuItem>
            </MenuHeader>
            <MenuHeader className={"bg-gray-500 py-2 text-white hover:bg-gray-400"}>
                <MenuItem>
                    <NavLink
                        to={"edit"}
                        className={({ isActive }) =>
                          isActive
                            ? "py-2 text-white"
                            : "text-white/50 hover:text-white"
                        }>
                        Edit
                    </NavLink>
                </MenuItem>
            </MenuHeader>
        </Menu>
    </div>
  )
}
export default FriendList;
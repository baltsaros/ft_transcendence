import { MenuItem, SubMenu } from "@szhsin/react-menu";
import { IUserUsername } from "../types/types";
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';


function ToggleMenuFriendList(user: IUserUsername) {

    //state


    //behaviour


    //render
    return (
        <div className="bg-gray-500">
            <SubMenu direction={"left"} label={user.username}>
            <div className="bg-gray-500">
                <MenuItem>View Profile</MenuItem>
            </div>
            <div className="bg-gray-500">
                <MenuItem>Direct message</MenuItem>
            </div>
            <div className="bg-gray-500">
                <MenuItem>Invite to game</MenuItem>
            </div>
            <div className="bg-gray-500">
                <MenuItem>Remove friend</MenuItem>
            </div>
            </SubMenu>
        </div> 
    );

}
export default ToggleMenuFriendList;
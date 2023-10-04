import { useEffect, useState } from "react";
import { PlayerService } from "../services/player.service";
import { IUserUsername } from "../types/types";
import Cookies from "js-cookie";
import ToggleMenuFriendList from "./ToggleMenuFriendList";
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import { Menu, MenuButton, MenuHeader } from '@szhsin/react-menu';
import { toast } from "react-toastify";


function FriendList() {

    //state
    const [friends, setFriends] = useState<IUserUsername[]>(
      [
        { username: 'Juan', status: 'online'}
      ]
    );

      useEffect(() =>  {
        const getAllFriendsForUser = async () => {
          try {
            const username = Cookies.get("username");
            if (username) {
              const id = await PlayerService.getInfoUser(username);
              if (!id)
                return (toast.error("User doesn't exists !"));
              const data =  await PlayerService.getAllFriends(id);
              if (!data)
                return (toast.error("Erro!"));
              setFriends(data);
            }
          } catch (err: any) {}}
          getAllFriendsForUser();
        }, [friends])

    //render
        return (
          <div className="text-black bg-gray-500">
            <Menu direction={"bottom"} arrow={true} align={"center"} menuButton={<MenuButton className="text-lg">Friend list</MenuButton>}>
              <div className="bg-gray-500 text-lg">
                <MenuHeader>Online</MenuHeader>
              </div>
              {friends.map((friend) => (
                friend.status ==="online" && <div className="bg-gray-500" key={friend.username}>
                   <ToggleMenuFriendList {...friend} />
                    </div>              
              ))}
              <div className="bg-gray-500 text-lg">
              <MenuHeader>Offline</MenuHeader>
              </div>
              {friends.map((friend) => (
                friend.status ==="offline" && <div className="bg-gray-500" key={friend.username}>
                    <ToggleMenuFriendList {...friend} />
                    </div>              
              ))}
            </Menu>
          </div>
        )
}
export default FriendList;
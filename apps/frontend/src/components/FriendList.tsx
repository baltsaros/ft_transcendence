import { useEffect, useState } from "react";
import { PlayerService } from "../services/player.service";
import { IUserUsername } from "../types/types";
import Cookies from "js-cookie";
import ToggleMenuFriendList from "./ToggleMenuFriendList";
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import { Menu, MenuButton, MenuHeader } from '@szhsin/react-menu';


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
              const data =  await PlayerService.getAllFriends(id.toString());
              setFriends(data);
            }
          } catch (err: any) {}}
          getAllFriendsForUser();
        }, [])

    //render
<<<<<<< HEAD
    return (
        <div className="absolute bottom-0 right-0 w-[340px] h-[340px]">
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="bg-gray-500 text-black absolute bottom-0 p-4 w-full flex justify-between font-bold text-lg tracking-wider border-2 border-transparent active:border-white duration-100 active:text-white">
            Friend List
            {!isOpen ? (
              <AiOutlineCaretUp className="h-8" />
            ) : (
              <AiOutlineCaretDown className="h-8" />
            )}
          </button>

          {isOpen && (
            <div className="bg-gray-500 h-40 text-black overflow-auto absolute text-left top-full flex flex-col  p-2 w-full">
              <div className="text-lg divide-y text-center">Online</div>
              {friends.map((friend) => (
                friend.status ==="online" && <div key={friend.username}>
                  {friend.username}
              </div>
              ))}
            <div className="text-lg divide-y text-center">Offline</div>
              {friends.map((friend) => (
                friend.status === "offline" && <div key={friend.username}>
                  {friend.username}
              </div>
              ))}
            </div>
            
          )}
        </div>
       
    );

=======
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
>>>>>>> main
}
export default FriendList;
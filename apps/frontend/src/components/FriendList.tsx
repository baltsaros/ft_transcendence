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


function FriendList() {

    //state
    const [friends, setFriends] = useState<IUserUsername[]>(
      [
        { username: 'Juan', status: 'online'}
      ]
    );

    const [invitations, setInvitations] = useState<IUserUsername[]>(
      [
        { username: 'Juan', status: 'online'}
      ]
    );
    const [friendsOnline, setFriendsOnline] = useState<Number>(0);
    const [friendsOffline, setFriendsOffline] = useState<Number>(0);

    const isOnline = (value: IUserUsername) => value.status === 'online';
    const isOffline = (value: IUserUsername) => value.status === 'offline';

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
              setFriendsOffline(friends.filter(isOffline).length)
              setFriendsOnline(friends.filter(isOnline).length)
            }
          } catch (err: any) {}}
          // getAllFriendsForUser();
        }, [friends])

        useEffect(() =>  {
          const getAllFriendsInvitations = async () => {
            try {
                const username = Cookies.get("username");
                if (username) {
                    const id = await PlayerService.getInfoUser(username);
                    if (!id)
                        return toast.error("User doesn't exists !");
                    const invit = await PlayerService.getAllInvitations(id);
                    if (!invit)
                        return toast.error("User doesn't exists !");
                    setInvitations(invit);
                }
            } catch (err: any) {}}
            // getAllFriendsInvitations();
          }, [invitations])

    //render
        return (
          <div className="py-2 ">
            <Menu direction={"bottom"} arrow={true} align={"center"} menuButton={<MenuButton className="text-lg"><FaUserFriends /></MenuButton>}>
              <div className="bg-green-500 text-lg">
                <MenuHeader className="text-white">Online</MenuHeader>
              </div>
              {friendsOnline > 0 && friends.map((friend) => (
                friend.status ==="online" && <div className="bg-gray-500" key={friend.username}>
                   <ToggleMenuFriendList {...friend} />
                    </div>              
              ))}
              {!friendsOnline && 
                <div className="bg-gray-500 flex items-center justify-center text-sm">
                  <MenuItem className="" disabled >No friends online</MenuItem>
                </div>
              }
              <div className="bg-red-500 text-lg">
              <MenuHeader className="text-white">Offline</MenuHeader>
              </div>
              {friendsOffline > 0 && friends.map((friend) => (
                friend.status ==="offline" && 
                  <div className="bg-gray-500" key={friend.username}>
                    <ToggleMenuFriendList {...friend} />
                  </div>              
              ))}
              {!friendsOffline && 
                <div className="bg-gray-500 flex items-center justify-center text-sm">
                  <MenuItem className="" disabled >No friends offline</MenuItem>
                </div>
              }
              <div className="bg-blue-500 text-lg">
                <MenuHeader className="text-white">Invitations : {invitations.length} </MenuHeader>
                <div className="bg-gray-500">
                  {invitations.length > 0 && invitations.map((invitation) => (
                    <FriendInvitations key={invitation.username} {...invitation} />
                  ))}
                  </div >
                  {!invitations.length &&
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
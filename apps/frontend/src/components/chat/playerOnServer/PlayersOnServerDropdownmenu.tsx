import { useState, useEffect, useRef } from 'react';
import { IChannel, IResponseUser } from '../../../types/types';
import { instance } from '../../../api/axios.api';
import { toast } from 'react-toastify';
import ButtonWithModal from './ButtonWithModal';
import { IChannelDmData, IPlayersOnServerModalProps } from '../../../types/types';
import Cookies from 'js-cookie';
import { PlayerService } from '../../../services/player.service';
import { Link, NavLink, Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { store } from '../../../store/store';
import { addChannel } from '../../../store/channel/channelSlice';
import { useChatWebSocket } from '../../../context/chat.websocket.context';

const DropdownButton = (player: IPlayersOnServerModalProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownButtonRef = useRef<any>(null);
  const dropdownMenuRef = useRef<any>(null);
  const [isUserBlocked, setIsUserBlocked] = useState(false);
  const [isUserFriend, setIsUserFriend] = useState(false);
  const userLogged = useSelector((state: RootState) => state.user.user);
  const webSocketService = useChatWebSocket();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleItemClick = (itemText: string) => {
    // Perform an action based on the clicked item
    console.log(`Clicked on: ${itemText}`);
    // You can add more logic here based on the clicked item
  };

  const isBlocked = async (username: string) => {
    //console.log(username);
    try {
         const blocker = Cookies.get("username");
         if (blocker) {
             const blockerId = await PlayerService.getInfoUser(blocker);
             if (blockerId)
                {
                 const blockedId = await PlayerService.getInfoUser(username);
                 if (blockedId)
                  {
                    const ret = await PlayerService.getBlocked({receiverId: blockedId, senderId: blockerId});
                    setIsUserBlocked(ret);
                  }
                }
          }
        } catch (err: any) {}};
      
  async function logBlockedStatus() {
    const result = await isBlocked(player.player.username);
    //console.log(result);
  }
  logBlockedStatus(); // Call the function to log the result

  const isFriend = async (username: string) => {
    //console.log(username);
    try {
         const sender = Cookies.get("username");
         if (sender) {
             const senderId = await PlayerService.getInfoUser(sender);
             if (senderId)
                {
                 const receiverId = await PlayerService.getInfoUser(username);
                 if (receiverId)
                  {
                    const ret = await PlayerService.getFriend({receiverId: receiverId, senderId: senderId});
                    setIsUserFriend(ret);
                  }
                }
          }
        } catch (err: any) {}};
  
  async function logFriendStatus() {
    const result = await isFriend(player.player.username);
    //console.log(result);
  }
  logFriendStatus(); // Call the function to log the result

  // console.log('result is', isUserFriend);

  const handleDirectMessage = async () => {
    try{ 
      const strings = [player.player.username, userLogged?.username];
      strings.sort();
      const channelName = strings.join('_');
      const channelData: IChannelDmData = {
          name: channelName,
          mode: 'private',
          sender: userLogged?.id!,
          receiver: player.player.username,
          password: '',
      }
      // 1. The new instance in the channel table could be done directly in the backend when emitting the event
      const newDmChannel = await instance.post('channel/dmChannel', channelData);
      const payload = {
        user: strings,
        id: newDmChannel.data.id,
      }
      webSocketService.emit('onNewDmChannel', payload);
      if (newDmChannel) {
        toast.success("Channel successfully added!");
        store.dispatch(addChannel(newDmChannel.data));
      }
  } catch (error: any) {
      const err = error.response?.data.message;
      toast.error(err.toString());
  } 
}

useEffect(() => {
  webSocketService.on('DmChannelJoined', (payload: IChannel) => {
    console.log('event DmChannelJoined received:', payload);
    store.dispatch(addChannel(payload));
  });
  return () => {
    webSocketService.off('DmChannelJoined');
  };
}, []);

  useEffect(() => {
    const closeDropdownOnOutsideClick = (event: Event) => {
      // Check if the click occurred outside the button and the dropdown menu
      if (
        dropdownButtonRef.current &&
        !dropdownButtonRef.current.contains(event.target as Node) &&
        dropdownMenuRef.current &&
        !dropdownMenuRef.current.contains(event.target as Node)
      ) {
        // Click occurred outside, so close the dropdown
        setIsDropdownOpen(false);
      }
    };

    // Add the global click event listener
    document.addEventListener('click', closeDropdownOnOutsideClick);

    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener('click', closeDropdownOnOutsideClick);
    };
  }, []);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleDropdown}
		    ref={dropdownButtonRef}
        className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
      >
        {player.player.username}
      </button>
      {isDropdownOpen && (
        <div 
			ref={dropdownMenuRef}
			className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
		>
          {/* Dropdown menu items */}
          <div className="py-1">
            <Link
              to={"/player/" + player.player.username}
              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer flex items-center justify-center"
            >
              View Profile
            </Link>
            <button
              onClick={() => handleDirectMessage()}
              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
            >
              Direct message
            </button>
            { (player.player.status === "online") ? (
            <button
              onClick={() => handleItemClick(`Invite to game for ${player.player.username}`)}
              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
            >
              Invite to game
            </button>
            ) : (
              <button
              className="block w-full px-4 py-2 text-sm text-gray-300 cursor-pointer"
              disabled
            >
              Invite to game
            </button>
            )
            }
            { isUserFriend ? (
              <button
              className="block w-full px-4 py-2 text-sm text-gray-300 cursor-pointer"
              disabled>
                Invite as Friend
              </button>
              ) : (
              <ButtonWithModal { ...{ player: player.player, text: "Invite as Friend", channel: player.channel } } />)}
            { isUserBlocked ? (
              <ButtonWithModal { ...{ player: player.player, text: "Unblock User", channel: player.channel } } />
              ) : (<ButtonWithModal { ...{ player: player.player, text: "Block User", channel: player.channel } } />)}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownButton;

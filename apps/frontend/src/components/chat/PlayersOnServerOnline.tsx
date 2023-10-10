import { useState, useEffect, useRef } from 'react';
import { instance } from '../../api/axios.api';
import ButtonWithModal from './ButtonWithModal';
import { IUserUsername, IChannelData } from '../../types/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const DropdownButtonOnLine = (player: IUserUsername) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownButtonRef = useRef<any>(null);
  const dropdownMenuRef = useRef<any>(null);
  const userLogged = useSelector((state: RootState) => state.user.user);
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  const handleItemClick = (itemText: string) => {
    // Perform an action based on the clicked item
    console.log(`Clicked on: ${itemText}`);
    // You can add more logic here based on the clicked item
  };

  const handleDirectMessage = () => {
    // 1. Handle channel creation for dm here
    try{ 
      const strings = [player.username, userLogged];
      strings.sort();
      const channelName = strings.join('_');
      const channelData: IChannelData = {
          name: channelName,
          mode: 'private',
          owner: userLogged!,
          password: '',
      }
      // const newChannel = await instance.post('channel', channelData);
  //     console.log('newChannel', newChannel.data);
  //     webSocketService.emit('onNewChannel', newChannel.data);
  //     if (newChannel) {
  //       toast.success("Channel successfully added!");
  //       store.dispatch(addChannel(newChannel.data));
  //     }
  } catch (error: any) {
      // const err = error.response?.data.message;
      // toast.error(err.toString());
  }
  // onClose();
    // 2. Update Redux state, component subscribed will re-render
    // 3. Update the onSelectChannel state
    
  }

  useEffect(() => {
    const closeDropdownOnOutsideClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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
    document.addEventListener('click', () => closeDropdownOnOutsideClick);

    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener('click', () => closeDropdownOnOutsideClick);
    };
  }, []);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleDropdown}
		    ref={dropdownButtonRef}
        className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
      >
        {player.username}
      </button>
      {isDropdownOpen && (
        <div 
			ref={dropdownMenuRef}
			className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
		>
          {/* Dropdown menu items */}
          <div className="py-1">
            <button
              onClick={() => handleItemClick(`View Profile for ${player.username}`)}
              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
            >
              View Profile
            </button>
            <button
              onClick={() => handleDirectMessage()}
              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
            >
              Direct message
            </button>
            <button
              onClick={() => handleItemClick(`Invite to game for ${player.username}`)}
              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
            >
              Invite to game
            </button>
            {/*
            <button
              onClick={() => handleItemClick(`Invite as friend for ${username}`)}
              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
            >
              Invite as friend
            </button>
            */}
            <ButtonWithModal { ...{username: player.username, text: "Invite as Friend"} } />
            {/*
            <button
            onClick={() => handleItemClick(`Block user for ${username}`)}
            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
            >
            Block user
            </button>
            */}
            <ButtonWithModal { ...{username: player.username, text: "Block User"} } />
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownButtonOnLine;

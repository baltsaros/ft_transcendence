import { useState, useEffect, useRef } from 'react';
import { IGetChannels, IUserUsername, IPlayersOnServerModalProps } from '../../../types/types';
import ButtonWithModal from './ButtonWithModal';

const DropdownButtonOffLine = (player: IUserUsername) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownButtonRef = useRef<any>(null);
  const dropdownMenuRef = useRef<any>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleItemClick = (itemText: string) => {
    // Perform an action based on the clicked item
    console.log(`Clicked on: ${itemText}`);
  };

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
              onClick={() => handleItemClick(`Direct message for ${player.username}`)}
              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
            >
              Direct message
            </button>
            <ButtonWithModal { ...{username: player.username, text: "Invite as Friend"} } />
            <ButtonWithModal { ...{username: player.username, text: "Block User"} } />
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownButtonOffLine;

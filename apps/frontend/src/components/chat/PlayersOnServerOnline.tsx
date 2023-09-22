import { useState, useEffect, useRef } from 'react';

const DropdownButtonOnLine = ({ username }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownButtonRef = useRef(null);
  const dropdownMenuRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleItemClick = (itemText) => {
    // Perform an action based on the clicked item
    console.log(`Clicked on: ${itemText}`);
    // You can add more logic here based on the clicked item
  };

  useEffect(() => {
    const closeDropdownOnOutsideClick = (event) => {
      // Check if the click occurred outside the button and the dropdown menu
      if (
        dropdownButtonRef.current &&
        !dropdownButtonRef.current.contains(event.target) &&
        dropdownMenuRef.current &&
        !dropdownMenuRef.current.contains(event.target)
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
        {username}
      </button>
      {isDropdownOpen && (
        <div 
			ref={dropdownMenuRef}
			className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
		>
          {/* Dropdown menu items */}
          <div className="py-1">
            <button
              onClick={() => handleItemClick(`View Profile for ${username}`)}
              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
            >
              View Profile
            </button>
            <button
              onClick={() => handleItemClick(`Direct message for ${username}`)}
              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
            >
              Direct message
            </button>
            <button
              onClick={() => handleItemClick(`Invite to game for ${username}`)}
              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
            >
              Invite to game
            </button>
            <button
              onClick={() => handleItemClick(`Invite as friend for ${username}`)}
              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
            >
              Invite as friend
            </button>
            <button
              onClick={() => handleItemClick(`Block user for ${username}`)}
              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
            >
              Block user
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownButtonOnLine;
import { useState } from 'react';
import InviteFriendModal from './InviteFriendModal';
import BlockUserModal from './BlockUserModal';
import { IPlayersOnServerModalProps } from '../../types/types';

function ButtonWithModal ( userWithText: IPlayersOnServerModalProps ) {

  // state
  const [modalView, setModalView] = useState(false);
  
  // behavior
  const handleOpenModal = () => {
    setModalView(true);
  }

const handleCloseModal = () => {
    setModalView(false);
  }
  
  //{console.log(userWithText.username)}
  //render
  return (
    <div>
      <button className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
      onClick={handleOpenModal}>
        { userWithText.text }
      </button>
      {modalView && userWithText.text === "Invite as Friend" &&
        <InviteFriendModal onClose={handleCloseModal} userWithText={userWithText} />
      }
      {modalView && userWithText.text === "Block User" &&
        <BlockUserModal onClose={handleCloseModal} userWithText={userWithText} />
      }
    </div>
  );
}

export default ButtonWithModal;

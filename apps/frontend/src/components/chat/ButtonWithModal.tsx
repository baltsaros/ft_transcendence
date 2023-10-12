import { useState } from 'react';
import { IPlayersOnServerModalProps } from '../../types/types';
import InviteFriendModal from './InviteFriendModal';
import BlockUserModal from './BlockUserModal';
import UnblockUserModal from './UnblockUserModal';

function ButtonWithModal ( player: IPlayersOnServerModalProps ) {

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
        { player.text }
      </button>
      {modalView && player.text === "Invite as Friend" &&
        <InviteFriendModal onClose={handleCloseModal} player={player} />
      }
      {modalView && player.text === "Block User" &&
        <BlockUserModal onClose={handleCloseModal} player={player} />
      }
      {modalView && player.text === "Unblock User" &&
        <UnblockUserModal onClose={handleCloseModal} player={player} />
      }
    </div>
  );
}

export default ButtonWithModal;

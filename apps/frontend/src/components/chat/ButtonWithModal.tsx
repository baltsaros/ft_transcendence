import { useState } from 'react';
import InviteFriendModal from './InviteFriendModal';

function ButtonWithModal ({ text }) {

  // state
  const [modalView, setModalView] = useState(false);
  
  // behavior
  const handleOpenModal = () => {
    setModalView(true);
  }

const handleCloseModal = () => {
    setModalView(false);
  }

  //render
  return (
    <div>
      <button className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
      onClick={handleOpenModal}>
        { text }
      </button>
      {modalView &&
        <InviteFriendModal onClose={handleCloseModal} />
      }
    </div>
  );
}

export default ButtonWithModal;

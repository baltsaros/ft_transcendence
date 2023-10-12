import Cookies from "js-cookie";
import { PlayerService } from "../../../services/player.service";
import { IPlayersOnServerModalProps } from '../../../types/types';


interface ModalProp {
    onClose: () => void; // Define the type of onClose prop as a function that returns void & takes no arg
}

const InviteFriendModal: React.FC<ModalProp & { player: IPlayersOnServerModalProps }> = ({onClose, player}) =>  {

	/* BEHAVIOR */
  //console.log('hello', userWithText.username);
	
	const handleCancel = () => {
		// console.log('store state:', store.getState());
		onClose();
	  }
  
  const sendInvitation = async (username: string) => {
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
                      const ret = await PlayerService.sendInvitation({receiverId, senderId});
                  }
              }
          }
          onClose();
      } catch (err: any) {}}
	
	/* RENDERING */
    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-opacity-50 bg-black">
        <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col">
          {/* Modal content */}
		  <p>Do you really want to invite this user as a friend?</p>
		  {/* Buttons */}
          <div className="flex justify-end">
            <button
              onClick={() => sendInvitation(player.player.username)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2 mt-4">Ok
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg mt-4" onClick={handleCancel}>Cancel</button>
          </div>
		</div>
		</div>
	)
}

export default InviteFriendModal;
import Cookies from "js-cookie";
import { IPlayersOnServerModalProps } from "../../types/types";
import { PlayerService } from "../../services/player.service";
import { useEffect, useState } from "react";

interface ModalProp {
    onClose: () => void; // Define the type of onClose prop as a function that returns void & takes no arg
}

const BlockUserModal: React.FC<ModalProp & { userWithText: IPlayersOnServerModalProps }> = ({onClose, userWithText}) =>  {


  
  /* BEHAVIOR */
  //console.log('hello', userWithText.username);
	
	const handleCancel = () => {
		// console.log('store state:', store.getState());
		onClose();
	  }
        
  const blockUser = async (username: string) => {
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
                    const ret = await PlayerService.blockUser({receiverId: blockedId, senderId: blockerId});
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
		  <p>Do you really want to block this user?</p>
		  {/* Buttons */}
          <div className="flex justify-end">
            <button
              onClick={() => blockUser(userWithText.username)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2 mt-4">Ok
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg mt-4" onClick={handleCancel}>Cancel</button>
          </div>
		</div>
		</div>
	)
}

export default BlockUserModal;
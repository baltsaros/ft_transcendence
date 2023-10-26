import Cookies from "js-cookie";
import { IPlayersOnServerModalProps } from "../../../types/types";
import { PlayerService } from "../../../services/player.service";
import { useEffect, useState } from "react";

interface ModalProp {
    onClose: () => void; // Define the type of onClose prop as a function that returns void & takes no arg
}

const UnblockUserModal: React.FC<ModalProp & { player: IPlayersOnServerModalProps }> = ({onClose, player}) =>  {


  
  /* BEHAVIOR */
  //console.log('hello', userWithText.username);
	
	const handleCancel = () => {
		// console.log('store state:', store.getState());
		onClose();
	  }
        
  const unblockUser = async (username: string) => {
    //console.log(username);
    try {
         const unblocker = Cookies.get("username");
         if (unblocker) {
             const unblockerId = await PlayerService.getInfoUser(unblocker);
             if (unblockerId)
               {
                 const unblockedId = await PlayerService.getInfoUser(username);
                 if (unblockedId)
                  {
                    const ret = await PlayerService.unblockUser({receiverId: unblockedId, senderId: unblockerId});
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
		  <p>Do you really want to unblock this user?</p>
		  {/* Buttons */}
          <div className="flex justify-end">
            <button
              onClick={() => unblockUser(player.player.username)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg mr-2 mt-4">Ok
            </button>
            <button className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4" onClick={handleCancel}>Cancel</button>
          </div>
		</div>
		</div>
	)
}

export default UnblockUserModal;
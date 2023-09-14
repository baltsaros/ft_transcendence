import { useEffect, useState } from "react";
import { AiOutlineCaretDown, AiOutlineCaretUp} from "react-icons/ai";
import { PlayerService } from "../services/player.service";
import { IUserUsername } from "../types/types";

function FriendList(id: string) {

    //state
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState("");
    // const [friends] = useState(
    //     [
    //     { name: 'Juan', active: true },
    //     { name: 'Tyler', active: true },
    //     { name: 'Michael', active: false },
    //     { name: 'Charles', active: true }
    //     ]
    // )

    const [friends, setFriends] = useState<IUserUsername[] | undefined>(
      [
            { username: 'Juan'},
            { username: 'Tyler' },
            { username: 'Michael' },
            { username: 'Charles' }
      ]
    );

    // console.log("username MatchHistory = " + userData.username);
  
    const getAllFriendsForUser = async () => {
      try {
        const data =  await PlayerService.getAllFriends(id);
        setFriends(data);
        console.log(data);
      } catch (err: any) {
    }

    useEffect(() => {
      getAllFriendsForUser();
    }, [id])

  }
    //behaviour

    //render
    return (
        <div className="absolute bottom-0 right-0 w-[340px] h-[340px]">
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="bg-gray-500 text-black absolute bottom-0 p-4 w-full flex justify-between font-bold text-lg tracking-wider border-2 border-transparent active:border-white duration-100 active:text-white">
            Friend List
            {!isOpen ? (
              <AiOutlineCaretUp className="h-8" />
            ) : (
              <AiOutlineCaretDown className="h-8" />
            )}
          </button>

          {isOpen && (
            <div className="bg-gray-500 h-40 text-black overflow-auto absolute top-full flex flex-col items-start p-2 w-full">
              {friends.map((friend) => (
                <div>
                  {friend.name}
                </div>
              ))}
            </div>
          )}
        </div>
       
    );

}
export default FriendList;
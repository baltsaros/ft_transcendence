import { IUserPlayerProfileData } from "../types/types";

export default function PlayerNameBox(user: IUserPlayerProfileData) {

    //state

    //behaviour

    //render
    return (
      <div className="w-96 text-2xl p-4 gap-4 rounded-lg shadow-lg bg-gray-400 from-blue-400 to-purple-500">
				<div>
          <p className="bg-gray-600 mt-2 rounded-lg p-2 gap-2 text-white">{user.username}</p>
        </div>
			  <div className="grid grid-cols-2 text-base gap-2">
				  <button className="rounded-lg bg-gray-600 p-2 text-white shadow-md">Send friend request</button>
				  <button className="rounded-lg bg-gray-600 p-2 text-white shadow-md">Block user</button>
			  </div>
		  </div>
    );
}

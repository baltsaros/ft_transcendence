import { IUserPlayerProfileData } from "../types/types";

export default function PlayerNameBox(user: IUserPlayerProfileData) {

    //state

    //behaviour

    //render
    return (
    <div className="w-96 text-2xl p-4 mt-16 rounded-lg shadow-lg bg-gray-400">
        <div className="text-4xl">{user.username}'s profile</div>
      </div>
    );
}

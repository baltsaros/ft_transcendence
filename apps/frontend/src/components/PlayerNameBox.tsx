import { IUserPlayerProfileData } from "../types/types";

export default function PlayerNameBox(user: IUserPlayerProfileData) {

    //state

    //behaviour

    //render
    return (
    <div className="bg-cyan-300 w-96 h-20 flex justify-center items-center">
        <div className="text-4xl">{user.username}'s profile</div>
      </div>
    );
}

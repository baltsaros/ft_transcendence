import { IUserPlayerProfileData } from "../types/types";

export default function PlyerProfileBox(user: IUserPlayerProfileData) {

    //state

    //behaviour

    //render
    return (
    <div className="w-96 text-2xl">
        <div className="grid grid-cols-2">
            <p className="bg-green-600">Wins: {user.wins}</p>
            <p className="bg-red-600">Losses: {user.losses}</p>
        </div>
        <div>
            <p className="bg-cyan-300">Rank: {user.rank}</p>
        </div>
    </div>
    );
}

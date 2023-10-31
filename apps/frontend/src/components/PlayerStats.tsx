import { IResponseChannelData, IResponseUser, IUserPlayerProfileData } from "../types/types";

export default function PlayerStats(user: IResponseUser) {

    //state

    //behaviour

    //render
    return (
		<div className="w-96 text-2xl p-4 rounded-lg shadow-lg bg-gray-400 from-blue-400 to-purple-500">
			<div className="grid grid-cols-2 gap-2">
				<p className="bg-green-500 rounded-lg p-2 text-white shadow-md">Wins : {user.wins}</p>
				<p className="bg-red-500 rounded-lg p-2 text-white shadow-md">Losses : {user.loses}</p>
			</div>
			<div>
				<p className="bg-gray-600 mt-2 rounded-lg p-2 text-white shadow-md">Elo : {user.rank}</p>
			</div>
		</div>
	);
}

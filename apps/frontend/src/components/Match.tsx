import { IMatch } from "../types/types";
import { NavLink } from "react-router-dom";

export default function Match(matchInfo: IMatch) {

    //state

    //behaviour

    //render
    return (
        <tr>
            <td>
            <div className="grid grid-cols-3 text-center">
                <div className="text-white bg-gray-800 rounded-md">{matchInfo.scoreUser} - {matchInfo.scoreOpponent}</div>
                {/* Check and display if match is a win or a loss. */}
                {matchInfo.scoreUser > matchInfo.scoreOpponent
                    ? <div className="text-white bg-green-600 rounded-md"> Win </div>
                    : <div className="text-white bg-red-600 rounded-md"> Loss </div>}
                     {/* font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline */}
                <NavLink reloadDocument className="text-white lowercase bg-blue-600 hover:bg-gray-400 focus:outline-none focus:shadow-outline w-full rounded-md" to={"/player/" + matchInfo.opponent.username}>
                    {matchInfo.opponent.username}
                </NavLink>
                {/* <div><Link to={"player/"+ matchInfo.opponent.username} className="btn btn-primary rounded-full w-full bg-cyan-300 text-black">{matchInfo.opponent.username}</Link></div> */}
                {/* <div><button className="rounded-full w-full bg-cyan-300 text-black" onClick={e=> handleClick(matchInfo.opponent.username)}>{matchInfo.opponent.username}</button></div> */}
            </div>
            </td>
        </tr>
    );
}

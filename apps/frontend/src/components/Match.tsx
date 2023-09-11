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
                <div>{matchInfo.scoreUser} - {matchInfo.scoreOpponent}</div>
                {/* Check and display if match is a win or a loss. */}
                {matchInfo.scoreUser > matchInfo.scoreOpponent
                    ? <div className="text-green-600"> Win </div>
                    : <div className="text-red-600"> Loss </div>}
                     {/* font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline */}
                <NavLink className="text-black lowercase bg-cyan-300 hover:bg-blue-700 focus:outline-none focus:shadow-outline w-full rounded-full" to={"/player/" + matchInfo.opponent.username}>
                    {matchInfo.opponent.username}
                </NavLink>
                {/* <div><Link to={"player/"+ matchInfo.opponent.username} className="btn btn-primary rounded-full w-full bg-cyan-300 text-black">{matchInfo.opponent.username}</Link></div> */}
                {/* <div><button className="rounded-full w-full bg-cyan-300 text-black" onClick={e=> handleClick(matchInfo.opponent.username)}>{matchInfo.opponent.username}</button></div> */}
            </div>
            </td>
        </tr>
    );
}

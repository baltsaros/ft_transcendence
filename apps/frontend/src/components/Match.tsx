import { IMatch } from "../types/types";

export default function Match(matchInfo: IMatch) {

    //state

    //behaviour

    //render
    return (
        <tr>
            <td>
            <div className="grid grid-cols-3 text-center">
                <div>{matchInfo.score} - {matchInfo.scoreOpponent}</div>
                {/* Check and display if match is a win or a loss. */}
                {matchInfo.score > matchInfo.scoreOpponent
                    ? <div className="text-green-600"> Win </div>
                    : <div className="text-red-600"> Loss </div>}
                <div><button className="rounded-full w-full bg-cyan-300 text-black">{matchInfo.opponent}</button></div>
            </div>
            </td>
        </tr>
    );
}

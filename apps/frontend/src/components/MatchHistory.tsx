import { useState } from "react";
import { IMatch } from "../types/types";
import Match from "./Match";

export default function MatchHistory() {

    //state
    const [matches] = useState<IMatch[]>([
        {id: 1, score:4, scoreOpponent:3, opponent: "hdony"},
        {id: 2, score:1, scoreOpponent:2, opponent: "abuzdin"},
        {id: 3, score:2, scoreOpponent:7, opponent: "ejoo-tho"}
      ])
    //behaviour

    //render
    return (
       <div className="border-2 dark:border-gray-600">
        <table className="w-96 divide-y-2 divide-gray-400">
          <thead className="divide-y-2 divide-gray-400">
            <tr>
              <td>
                <div className="text-2xl text-gray-400 text-xl">  
                  <div className="bg-cyan-300 text-black text-2xl">
                    <div>MATCH HISTORY</div>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className=" text-xl grid grid-cols-3 text-center">
                  <div>Score</div>
                  <div>Win/Loss</div>
                  <div>Opponent</div>
               </div>
              </td>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-gray-400">
            {matches.map((match) => (
              <Match key={match.id}
                  {...match}
                />
            ))}
          </tbody>
        </table>
        
      </div>
    );
}

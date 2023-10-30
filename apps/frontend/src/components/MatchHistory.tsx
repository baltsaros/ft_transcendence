import { useEffect, useState } from "react";
import { IMatch, IUserPlayerProfileData } from "../types/types";
import Match from "./Match";
import { toast } from "react-toastify";
import { MatchService } from "../services/matches.service";
import Scrollbar from "react-scrollbars-custom";


export default function MatchHistory(userData: IUserPlayerProfileData) {

    //state
    const [matches, setMatches] = useState<IMatch[] | undefined>([
        {id: NaN, user: {username: "undefined", status: "offline"}, scoreUser:-1, scoreOpponent:-1, opponent: {username: "undefined", status: "offline"}},
      ])

      const getAllMatchForUser = async () => {
      try {
        const data =  await MatchService.getAllMatchForPlayer(userData.username!);
        setMatches(data);
      } catch (err: any) {
        const error = err.response?.data.message;
        toast.error(error.toString());
      }
    }
    //behaviour
    useEffect(() => {
      getAllMatchForUser();
    }, [userData.username])

    //render
    return (
       <div className="border-2 dark:border-gray-600">
        <table className="w-96 divide-y-2 divide-gray-400">
          <thead className="divide-y-2 divide-gray-400">
            <tr>
              <td>
                <div className="text-2xl text-gray-400 text-xl">
                  <div className="bg-gray-400 text-white text-2xl">
                    <div>MATCH HISTORY</div>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className=" text-xl grid grid-cols-3 text-center">
                  <div >Score</div>
                  <div>Win/Loss</div>
                  <div>Opponent</div>
               </div>
              </td>
            </tr>
          </thead>
          <Scrollbar style={{ width: 400, height: 150 }}>
            <div>
              <table className="w-96 divide-y-2 divide-gray-400">
                <tbody className="divide-y-2 divide-gray-400">
                  {matches!.map((match) => (
                    <Match key={match.id}
                        {...match}
                      />
                  ))}
                </tbody>
              </table>
            </div>
          </Scrollbar>
        </table>
      </div>
    );
}

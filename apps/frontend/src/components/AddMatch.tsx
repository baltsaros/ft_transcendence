import * as React from "react";
import { useState } from "react";
import { MatchService } from "../services/matches.service";
import { IMatch } from "../types/types";
import { toast } from "react-toastify";

export default function MatchForm() {

    //state
    const [ username, setUsername] = useState<string>("");
    const [ opponent, setOpponent] = useState<string>("");
    const [ scoreUser, setScoreUser ] = useState<number>(0);
    const [scoreOpponent, setScoreOpponent ] = useState<number>(0);

    //behaviour
    const addMatch = async (e: React.FormEvent<HTMLFormElement>) => {
        // console.log("user = " + user);
        // console.log("oppponent = " + opponent);
        // console.log("scoreUser = " + scoreUser);
        // console.log("scoreOpponent = " + scoreOpponent);
        try {
            e.preventDefault();
            const data = await MatchService.createMatch({
                username,
                opponent,
                scoreUser,
                scoreOpponent
            })
            if (data)
            {
                console.log(data)
                toast.sucess("Match successfully created");
            }
        } catch (err: any) {
            // const error = err.response?.data.message;
            // toast.error(error.toString());
        }
    }

    //render
    return (
        <div className="w-full max-w-xs">
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Username
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text"  onChange={(e) => setUsername(e.target.value)}></input>
                </div>
                <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Opponent
                </label>
                <input className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="opponent" type="text"  onChange={(e) => setOpponent(e.target.value)}></input>
                </div>
                <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Score user
                </label>
                <input className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="scoreUser" type="number"  onChange={(e) => setScoreUser(e.target.value)}></input>
                </div>
                <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Score opponent
                </label>
                <input className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="scoreOpponent" type="number"  onChange={(e) => setScoreOpponent(e.target.value)}></input>
                </div>
                <div className="flex items-center justify-between">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={addMatch}>
                    Add Match
                </button>
                </div>
            </form>
        </div>
    );
}

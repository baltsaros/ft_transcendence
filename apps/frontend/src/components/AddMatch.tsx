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
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        // e.preventDefault();
        try {
            const data = await MatchService.addMatch({
                username,
                opponent,
                scoreUser,
                scoreOpponent
            });
            if (data) {
              toast.success("User information was successfully updated!");
              window.location.reload();
            }
        } catch (err: any) {
            const error = err.response?.data.message;
            toast.error(error.toString());
        }
    };

    const deleteAllMatches = async () => {
        await MatchService.deleteAllMatches();
    }

    //render
    return (
        <div className="w-full max-w-xs">
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Username
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)}></input>
                    </label>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Opponent
                        <input className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="opponent" type="text"  value={opponent} onChange={(e) => setOpponent(e.target.value)}></input>
                    </label>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Score user
                        <input className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="scoreUser" type="number"  value={scoreUser} onChange={(e) => setScoreUser(e.target.value)}></input>
                    </label>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Score opponent
                        <input className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="scoreOpponent" type="number" value={scoreOpponent} onChange={(e) => setScoreOpponent(e.target.value)}></input>
                    </label>
                </div>
                <div className="flex items-center justify-between">
                    <input className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit" value="Add match" />
                </div>
            </form>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={deleteAllMatches}>
                Delete all matches
            </button>
        </div>
    );
}

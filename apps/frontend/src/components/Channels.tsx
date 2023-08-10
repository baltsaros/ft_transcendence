import AddChannel from "./AddChannel";
import { useEffect, useState } from 'react';
import { instance } from '../api/axios.api'
// import { useAppSelector } from "../store/hooks";
// import { RootState } from "../store/store";
import { IGetChannels } from "../types/types"
import Cookies from "js-cookie";

function Channels() {
    /* STATE */
    // const user = useAppSelector((state: RootState) => state.user.user);
    const [data, setData] = useState([]);
    
    /* BEHAVIOR */
    useEffect(() => {
        const user = Cookies.get('username');
        if (user) {
            const username: string = user;
            const channels: IGetChannels = {
                username: username,
            }
            console.log(channels.username);
            const fetchData = async () => {
                const result = await instance.get('channels', channels);
                console.log (result.data);
                setData(result.data);
                // console.log(result.data);
            }
            fetchData();
        }
    }, []);

    /* RENDER */
    return (   
        <div className="flex flex-col items-stretch justify-center h-screen bg-gray-100 w-full">
                <div className="flex flex-grow w-full">
                    <div className="flex flex-col flex-1 p-4 border bg-gray-100 m-2">
                        <div className="flex-shrink-0 p-4 border bg-gray-100 m-2">
                            <h1 className="text-lg font-bold mb-2 text-gray-600">Channels</h1>
                            <div className="flex flex-col text-black space-y-4">
                                {data.map((item, index) => (
                                <button className="bg-blue-300 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded" key={index}>{item}</button>))
                                }
                            </div>
                        </div>
                        <div className="mt-auto">
                            <AddChannel/>
                        </div>
                    </div>
                </div>
            </div>
    );

}

export default Channels;
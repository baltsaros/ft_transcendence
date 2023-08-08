import AddChannel from "./AddChannel";
import { useEffect, useState } from 'react';
import { instance } from '../api/axios.api'
import { useAppSelector } from "../store/hooks";
import { RootState } from "../store/store";
import { IGetChannels } from "../types/types"

function Channels() {
    /* STATE */
    const user = useAppSelector((state: RootState) => state.user.user);
    const [data, setData] = useState([]);
    console.log(user.username);


    /* BEHAVIOR */
    useEffect(() => {
        const channels: IGetChannels = {
            username: user.username,
        }
        console.log(channels.username);
        const fetchData = async () => {
            const result = await instance.get('channels', channels);
            console.log (result.data);
            setData(result.data);
        }
        fetchData();
    }, []);

    /* RENDER */
    return (   
        <div className="flex flex-col items-stretch justify-center h-screen bg-gray-100 w-full">
                <div className="flex flex-grow w-full">
                    <div className="flex flex-col flex-1 p-4 border bg-gray-100 m-2">
                        <div className="flex-shrink-0 p-4 border bg-gray-100 m-2">
                            <h1 className="text-lg font-bold mb-2 text-gray-600">Channels</h1>
                            <div className="text-black">
                                <ul>
                                    {data.map(name => <li>{name}</li>)}
                                </ul>
                            </div>
                        </div>
                        <div className="mt-auto">
                            <AddChannel/>
                            <button
                                className="text-black"
                                onClick={test}>TEST</button>
                        </div>
                    </div>
                </div>
            </div>
    );

}

export default Channels;
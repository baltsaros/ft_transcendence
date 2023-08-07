import AddChannel from "./AddChannel";
import { useEffect, useState } from 'react';
import { instance } from '../api/axios.api'
import { useAppSelector } from "../store/hooks";
import { RootState } from "../store/store";

function Channels() {
    /* STATE */
    const user = useAppSelector((state: RootState) => state.user.user);
    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const result = await instance.get('channels', user.username);
            console.log (result.data);
            setData(result.data);
        }
    }, []);

    /* BEHAVIOR */

    /* RENDER */
    return (   
        <div className="flex flex-col items-stretch justify-center h-screen bg-gray-100 w-full">
                <div className="flex flex-grow w-full">
                    <div className="flex flex-col flex-1 p-4 border bg-gray-100 m-2">
                        <div className="flex-shrink-0 p-4 border bg-gray-100 m-2">
                            <h1 className="text-lg font-bold mb-2 text-gray-600">Channels</h1>
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
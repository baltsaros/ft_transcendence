import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Scrollbar } from 'react-scrollbars-custom';

export default function SearchBar() {
    
    //state
    const [ input, setInput ] =useState<string>("");
    const channels = useSelector((state: RootState) => state.channel.channel);

    const filteredData = channels.filter((el) => {
        if (input === '')
            return el;
        else
            return el.name.toLowerCase().match("^" + input);
    })
    
    //behaviour
    //render
    return (
        <div>
            <input
                type="search"
                className="relative flex-auto rounded-l border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
                placeholder="Search"
                aria-label="Search"
                aria-describedby="button-addon1"
                onChange={(e) => setInput(e.target.value.toLocaleLowerCase())}
            />
            <Scrollbar style={{width: 250, height: 250}}>

                <ul>
                {(input !== "") && filteredData.map((item) => (
                    <li key={item.id}>{item.name}</li>
                ))}
            </ul>
            </Scrollbar>
        </div>
    );
}  

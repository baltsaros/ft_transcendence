import { useState } from "react";

function ChatBar() {
    // state
    const [sample, setSample] =  useState("Sample");

    // behavior
    // const handleClick = () => {
    //     alert("handleClick");
    // }

    const handleSubmit = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value);
        setSample(event.target.value);
    }

    // render
    return (
        <div className="flex text-black items-center bg-gray-200 p-2">
            {/* <form action="submit" onSubmit={handleSubmit}> */}
                <input
                value={sample}
                type="text" 
                placeholder="Type your message..."
                onChange={handleChange}
                className="flex-grow p-2 border rounded-l-lg"
                />
            {/* </form> */}
            <button className="bg-blue-500 text-white p-3 rounded-r-lg">Send</button>
        </div>
    );
}

export default ChatBar;
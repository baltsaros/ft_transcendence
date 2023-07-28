function ChatInterface() {
    // state

    // behavior

    // render
    /* <div> is a container to encapsulate jsx code */
    return (   
    <div className="flex flex-col items-stretch justify-center h-screen bg-gray-100 w-full">
        <div className="flex flex-grow w-full">
            <div className="flex-1 p-4 border bg-white m-2">
            <h1 className="text-lg font-bold mb-2 text-gray-600">Channels</h1>
            </div>
            <div className="flex-1 p-4 border bg-white m-2">
            <h1 className="text-lg font-bold mb-2 text-gray-600">Chat</h1>
            </div>
            <div className="flex-1 p-4 border bg-white m-2">
            <h1 className="text-lg font-bold mb-2 text-gray-600">Players on the server</h1>
            </div>
        </div>
    </div>
    )
};

export default ChatInterface;

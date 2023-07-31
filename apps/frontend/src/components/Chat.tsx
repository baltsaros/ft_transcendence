import ChatBar from "./ChatBar";
// import ChatList from "./ChatList";

function Chat() {
    // state

    // type Message = {
    //     senderId: string,
    //     text: string,
    // }

    // const dummyData: Message[] = [
    //     {
    //         senderId: "hdony",
    //         text: "hello"
    //     },
    //     {
    //         senderId: "jvander",
    //         text: "hey"
    //     }
    // ]

    // behavior

    // render
    /* <div> is a container to encapsulate jsx code */
    return (   
    <div className="flex flex-col items-stretch justify-center h-screen bg-gray-100 w-full">
        <div className="flex flex-grow w-full">
            <div className="flex flex-col flex-1 p-4 border bg-gray-100 m-2">
                <div className="flex-shrink-0 p-4 border bg-gray-100 m-2">
                    <h1 className="text-lg font-bold mb-2 text-gray-600">Chat</h1>
                </div>
                <div className="mt-auto">
                    {/* <ChatList /> */}
                    <ChatBar />
                </div>
            </div>
        </div>
    </div>
    );
};

export default Chat;

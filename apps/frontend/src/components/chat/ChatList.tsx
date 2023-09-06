type Message = {
    senderId: string;
    content: string;
  };
  
  type ChatListProps = {
    messageProp: Message[]; // Use the Message type for the 'messageList' prop
  };

function ChatList({messageProp}: ChatListProps) {
    /* STATE */

    /* BEHAVIOR */

    /* RENDER */
    return (
        <div className="max-w-lg mx-auto">
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <div className="space-y-2">
            {messageProp.map((message, index) => (
              <div key={index} className="flex items-start">
                <div className="bg-blue-500 text-white p-2 rounded-lg">
                  <strong>{message.senderId}:</strong>
                </div>
                <div className="ml-2">
                  <span className="bg-gray-200 p-2 rounded-lg">{message.content}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
    )
}

export default ChatList;
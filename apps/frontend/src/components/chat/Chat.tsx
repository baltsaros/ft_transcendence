import { Scrollbar } from "react-scrollbars-custom";
import { useEffect, useRef } from "react";
import { IChannel, IMessage, IResponseMessage } from "../../types/types";
import { useChatWebSocket } from "../../context/chat.websocket.context";
import ChatBar from "./ChatBar";
import { useSelector } from "react-redux";
import { RootState, store } from "../../store/store";
import {
  removeUser,
  removeOwner,
  addMessage,
} from "../../store/channel/channelSlice";
import { fetchBlocked } from "../../store/blocked/blockedSlice";

interface ChildProps {
  selectedChannel: IChannel | null;
}

const Chat: React.FC<ChildProps> = ({ selectedChannel }) => {
  const webSocketService = useChatWebSocket();

  /* STATE */
  const blocked = useSelector((state: RootState) => state.blocked);
  const userLogged = useSelector((state: RootState) => state.user);
  const channel = useSelector((state: RootState) => state.channel.channel);
  let messages: IMessage[];
  if (selectedChannel) {
    const channelSelected = channel.find(
      (channel) => channel.id === selectedChannel!.id
    );
    messages = channelSelected!.messages;
  }

  /* BEHAVIOR */
  useEffect(() => {
    store.dispatch(fetchBlocked(userLogged.user!.id));
  }, []);

useEffect(() => {
  if (webSocketService) {
    webSocketService.on('onMessage', (payload: IResponseMessage) => {
              store.dispatch(addMessage(payload));
      });
      return () => {
          webSocketService.off('onMessage');
      };
  }  
}, []);

  useEffect(() => {
    if (webSocketService) {
      webSocketService.on("ownerLeft", (payload: any) => {
        store.dispatch(removeOwner(payload));
      });
      return () => {
        webSocketService.off("ownerLeft");
      };
    }
  }, []);

  /* RENDER */
  return (
    <div className="flex flex-col items-stretch justify-center h-screen bg-gray-100 w-full">
        <div className="flex flex-grow w-full">
            <div className="flex flex-col flex-1 p-4 border bg-gray-100 m-2">
                <div className="flex-shrink-0 p-4 border bg-gray-100 m-2">
                {
                    selectedChannel &&
                    <h1 className="text-lg font-bold mb-2 text-gray-600">{selectedChannel?.name}</h1>
                }
                {
                    !selectedChannel &&
                    <h1 className="text-lg font-bold mb-2 text-gray-600">Chat</h1>
                }
                </div>
                <div className="text-lg font-bold mb-2 text-gray-600">
                    {<Scrollbar style={{ width: 300, height: 700 }}>
                    {
                        selectedChannel &&
                        messages!.map((idx, index) => (
                            !blocked.users.some((elem) => elem.username === idx.username) &&
                            <div
                            key={index}
                            className={`${
                                idx.username === 'User1' ? 'self-start' : 'self-end'
                            } p-2 rounded-lg mb-2`}
                            >
                        <div className="text-sm font-semibold">
                        {idx.username}
                      </div>
                      <div className="bg-white p-2 rounded-lg shadow-md">
                        {idx.content}
                      </div>
                    </div>
                  ))}
              </Scrollbar>
            }
            {!selectedChannel && <h2>Select a channel</h2>}
          </div>
          <div className="mt-auto">
            {selectedChannel && <ChatBar selectedChannel={selectedChannel} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;

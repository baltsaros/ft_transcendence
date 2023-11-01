import { useEffect, useRef } from "react";
import { IMessage, IResponseMessage } from "../../types/types";
import { useChatWebSocket } from "../../context/chat.websocket.context";
import ChatBar from "./ChatBar";
import { useSelector } from "react-redux";
import { RootState, store } from "../../store/store";
import {
  removeOwner,
  addMessage,
} from "../../store/channel/channelSlice";
import { fetchBlocked } from "../../store/blocked/blockedSlice";
import { useChannel } from "../../context/selectedChannel.context";

// interface ChildProps {
//   selectedChannel: IChannel | null;
// }

function Chat() {
  const selectedChannelContext = useChannel();
// const Chat: React.FC<ChildProps> = ({ selectedChannel }) => {
  const webSocketService = useChatWebSocket();

  /* STATE */
  const blocked = useSelector((state: RootState) => state.blocked);
  const userLogged = useSelector((state: RootState) => state.user);
  const channel = useSelector((state: RootState) => state.channel.channel);
  let messages: IMessage[];
  if (selectedChannelContext.selectedChannel) {
    const channelSelected = channel.find(
      (channel) => channel.id === selectedChannelContext.selectedChannel?.id
    );
    messages = channelSelected!.messages;
  }
  const scrolledElementRef = useRef<HTMLDivElement | null>(null);

  const keepScrolledDown = () => {
    if (scrolledElementRef.current) {
      const element = scrolledElementRef.current;
      element.scrollTop = element.scrollHeight;
    }
  };

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

  useEffect(() => {
    keepScrolledDown();
  });

    /* RENDER */
    return (
        <div className="flex items-stretch justify-center h-screen bg-gray-100 w-full">
          <div className="flex flex-grow w-full">
            <div className="flex flex-col flex-1 p-4 border bg-gray-100 m-2">
                <div className="flex-shrink-0 p-4 border bg-gray-100 m-2">
                {
                    selectedChannelContext.selectedChannel &&
                    <h1 className="text-lg font-bold mb-2 text-gray-600">{selectedChannelContext.selectedChannel.name}</h1>
                }
                {
                    !selectedChannelContext.selectedChannel &&
                    <h1 className="text-lg font-bold mb-2 text-gray-600">Chat</h1>
                }
                </div>
                <div className="text-lg font-bold mb-2 text-gray-600 overflow-y-scroll h-600"
                  ref={scrolledElementRef}>
                    {
                        selectedChannelContext.selectedChannel &&
                        messages!.map((idx, index) => (
                            !blocked.users.some((elem) => elem.username === idx.user!.username) &&
                            <div
                            key={index}
                            className=" self-end p-2 rounded-lg mb-2"
                            >
                              <div className="text-sm">
                                {idx.user?.username}
                              </div>
                              <div className="grid grid-cols-3 gap-4">
                                    {idx.user?.username === userLogged.username &&
                                    <div
                                    key={index}
                                    className="col-start-2 col-end-4 bg-blue-200 p-2 rounded-lg shadow-md auto-rows-max overflow-y-auto" >
                                    {idx.content}
                                    </div>
                                    }
                                    {idx.user?.username !== userLogged.username &&
                                    <div
                                    key={index}
                                    className="col-start-1 col-end-3 bg-white p-2 rounded-lg shadow-md auto-rows-max overflow-y-auto" >
                                    {idx.content}
                                    </div>
                                    }
                                  </div>
                              {/*<div className="bg-white p-2 rounded-lg shadow-md auto-rows-max w-64 overflow-y-auto" >
                                {idx.content}
                              </div>*/}
                            </div>
                        ))}
                    {!selectedChannelContext.selectedChannel && <h2>Select a channel</h2>}
          </div>
          <div className="mt-auto">
            {selectedChannelContext.selectedChannel && <ChatBar/>}
            {/* {selectedChannelContext.selectedChannel && <ChatBar selectedChannel={selectedChannel} />} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
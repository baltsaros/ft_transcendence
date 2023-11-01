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
    console.log('blocked', blocked.users);
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

		<div className="flex flex-col flex-1 p-4 border rounded-lg bg-white m-6  h-[80vh] ">
		<div className="p-4 bg-gray-200 rounded-t-lg">
		  <h1 className="text-2xl font-semibold mb-2 text-gray-800">
			{selectedChannelContext.selectedChannel ? selectedChannelContext.selectedChannel.name : "Chat"}
		  </h1>
		</div>
		<div className="text-lg font-bold mb-2 text-gray-600 overflow-y-scroll" ref={scrolledElementRef}>
		  {selectedChannelContext.selectedChannel && messages!.map((idx, index) => (
			!blocked.users.some((elem) => elem.username === idx.user!.username) && (
			  <div key={index} className="self-end p-2 rounded-lg mb-2">
				<div className="text-sm">
				  {idx.user?.username}
				</div>
				<div className="grid grid-cols-3 gap-4">
				  {idx.user?.username === userLogged.username && (
					<div key={index} className="col-start-2 col-end-4 bg-blue-200 p-2 rounded-lg shadow-md auto-rows-max overflow-y-auto">
					  {idx.content}
					</div>
				  )}
				  {idx.user?.username !== userLogged.username && (
					<div key={index} className="col-start-1 col-end-3 bg-gray-100 p-2 rounded-lg shadow-md auto-rows-max overflow-y-auto">
					  {idx.content}
					</div>
				  )}
				</div>
			  </div>
			)
		  ))}
		</div>
		  {!selectedChannelContext.selectedChannel && <h2 className="text-2xl font-semibold mt-10 mb-2 text-gray-800">Select a channel</h2>}
		<div className="mt-auto rounded-lg">
		  {selectedChannelContext.selectedChannel && <ChatBar />}
		</div>
	  </div>

  );
};

export default Chat;
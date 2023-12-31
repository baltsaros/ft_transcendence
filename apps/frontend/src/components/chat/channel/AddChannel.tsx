import { useState, useEffect } from "react";
import { RootState, store } from "../../../store/store";
import AddChannelModal from "./AddChannelModal";
import { useChatWebSocket } from "../../../context/chat.websocket.context";
import { addChannel } from "../../../store/channel/channelSlice";
import { IChannel } from "../../../types/types";
import { useSelector } from "react-redux";

function AddChannel() {
  const webSocketService = useChatWebSocket();
  const user = useSelector((state: RootState) => state.user);
  const blocked = useSelector((state: RootState) => state.blocked);
  const status = useSelector((state: RootState) => state.blocked.status);
  // console.log('user', user);

  /* STATE */
  const [modalView, setModalView] = useState(false);

  /* BEHAVIOUR */
  const handleOpenModal = () => {
    setModalView(true);
  };

  const handleCloseModal = () => {
    setModalView(false);
  };

  useEffect(() => {
    if (webSocketService) {
      webSocketService.on("newChannelCreated", (payload: any) => {
        store.dispatch(addChannel(payload));
      });

      return () => {
        webSocketService.off("newChannelCreated");
      };
    }
  }, []);

  useEffect(() => {
    if (webSocketService) {
      webSocketService.on("DmChannelJoined", (payload: IChannel) => {
        console.log("ws event received");
        store.dispatch(addChannel(payload));
      });
      return () => {
        webSocketService.off("DmChannelJoined");
      };
    }
  }, []);

  /* RENDER */
  return (
    <div>
      <button
        className="bg-green-500 hover:bg-green-600 text-gray p-3 rounded-lg"
        onClick={handleOpenModal}
      >
        Add a new channel
      </button>
      {modalView && <AddChannelModal onClose={handleCloseModal} />}
    </div>
  );
}

export default AddChannel;

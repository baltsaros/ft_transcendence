import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { Scrollbar } from "react-scrollbars-custom";
import { useChatWebSocket } from "../../../context/chat.websocket.context";
import { store } from "../../../store/store";
import {
  updateChannelPassword,
  addNewUser,
} from "../../../store/channel/channelSlice";
import {
  IChannel,
  IChannelPassword,
  IResponseUser,
} from "../../../types/types";
import bcrypt from "bcryptjs";
import { ChannelService } from "../../../services/channels.service";
import { toast } from "react-toastify";
import JoinPvtChannelModal from "./JoinPvtChannelModal";

export default function SearchBar() {
  const webSocketService = useChatWebSocket();
  const userLogged = useSelector((state: RootState) => state.user);
  const [modalView, setModalView] = useState(false);

  /* STATE */
  const [input, setInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const channels = useSelector((state: RootState) => state.channel.channel);

  const isTrue = (user: IResponseUser) => {
    return user.intraId === userLogged.user?.intraId;
  };

  const filterFunction = (channel: IChannel) => {
    const isUserInChannel = channel.users.some(isTrue);
    const isDm = channel.dm
    return !isUserInChannel && !isDm;
  };

  const AccessibleChannel = channels.filter(filterFunction);

  const filteredData = AccessibleChannel.filter((el) => {
    filterFunction(el);
    if (input === "") return el;
    else return el.name.toLowerCase().match("^" + input);
  });

  /* BEHAVIOUR */

  const handleChannelPassword = async (channel: IChannel) => {
    console.log("channel", channel);
    console.log("password", passwordInput);
    try {
      const data = await ChannelService.getHashedPassword(channel.id);
      const isMatch = bcrypt.compareSync(passwordInput, data.hashed);
      setPasswordInput("");
      if (!isMatch) toast.error("Incorrect password! Try again.");
      else {
        toast.success("Access granted!");
        const payload = {
          channelId: channel.id,
          username: userLogged.username,
        };
        if (webSocketService) webSocketService.emit("onChannelJoin", payload);
      }
    } catch (err: any) {
      console.log("join channel failed");
    }
  };

  const handleJoinChannel = async (channel: IChannel) => {
    console.log("channel", channel);
    try {
      console.log('channel banned', channel.banned);
      if (channel.banned) {if (channel.banned.some((b) =>
        b.username === userLogged.username
    )) {
        return toast.error("You have been banned from this channel");
    }}
      const payload = {
        channelId: channel.id,
        username: userLogged.username,
      };
      if (webSocketService) webSocketService.emit("onChannelJoin", payload);
      setInput("");
    } catch (err: any) {
      console.log("join channel failed", err);
    }
  };

  useEffect(() => {
    if (webSocketService) {
      webSocketService.on("userJoined", (payload: any) => {
        console.log("user", payload.user.username, "joined", payload.channelId);
        store.dispatch(addNewUser(payload));
      });
      return () => {
        webSocketService.off("userJoined");
      };
    }
  }, []);

  useEffect(() => {
    if (webSocketService) {
      webSocketService.on("userJoinedError", (payload: string) => {
        console.log("event received");
        alert(payload);
      });
      return () => {
        webSocketService.off("userJoinedError");
      };
    }
  }, []);

  useEffect(() => {
    if (webSocketService) {
        webSocketService.on("setChannelPassword", (payload: IChannelPassword) => {
            console.log("ws event received");
            store.dispatch(updateChannelPassword(payload));
        });
        return () => {
            webSocketService.off("setChannelPassword");
        };
    }
  }, []);

const handleOpenModal = () => {
    setModalView(true);
  }

  const handleCloseModal = () => {
    setModalView(false);
  }

  /* RENDER */
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
      <Scrollbar style={{ width: 250, height: 250 }}>
        <div>
          {input !== "" &&
            filteredData.map((channel) => (
              <div key={channel.id}>
                <h3>{channel.name}</h3>
                {channel.mode === "Private" ? (
                  <div>
                    {/* <input
                      type="password"
                      placeholder="Enter the channel password"
                      onChange={(e) => setPasswordInput(e.target.value)}
                    /> */}
                    <button
                      className="bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-lg"
                      onClick={handleOpenModal}
                    >Join
                    </button>
                    {modalView && <JoinPvtChannelModal onClose={handleCloseModal} channel={channel}/>}
                  </div>
                ) : (
                  // Condition for public channels
                  <button
                    className="bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-lg"
                    onClick={() => handleJoinChannel(channel)}
                  >
                    Join
                  </button>
                )}
              </div>
            ))}
        </div>
      </Scrollbar>
    </div>
  );
}

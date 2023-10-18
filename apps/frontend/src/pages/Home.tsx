import { FC, useEffect, useRef } from "react";
import { useState } from "react";
import ftLogo from "../assets/42_Logo.svg";
import { NavLink } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { RootState } from "../store/store";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useAuth } from "../hooks/useAuth";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import FriendList from "../components/FriendList";
import userSlice from "../store/user/userSlice";
import { toast } from "react-toastify";
import FriendInvitations from "../components/FriendInvitations";
import { ChannelService } from "../services/channels.service";
import { IChannelPassword, IChannelRelation } from "../types/types";
import SettingsGame from "./GameSettings";
import WaitingGame from "../components/WaitingGame";
import { usePongWebSocket } from "../context/pong.websocket.context";
import { io, Socket } from "socket.io-client";

const Home: FC = () => {
  // const user = useAppSelector((state: RootState) => state.user.user);
  const isAuth = useAuth();
  const dispatch = useAppDispatch();
  const [count, setCount] = useState(0);
  const token = Cookies.get('jwt_token');
  const webSocketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (token){
      const decoded = jwtDecode<any>(Cookies.get('jwt_token')!)
      if (decoded)
        Cookies.set('username', decoded.username, {sameSite: "none", secure: true});
      }
  },  [])

  const [modalView, setModalView] = useState<boolean>(false);

    // Créez la socket WebSocket si elle n'existe pas déjà

  const handleOpenModal = () => {
    // Ouvrez le modal en passant la socket WebSocket en tant que prop
	if (!webSocketRef.current) {
		webSocketRef.current = io('ws://localhost:3000/pong', {
		  query: {
			username: Cookies.get('username'),
		  },
		});
	}
    setModalView(true);
  };

  const handleCloseModal = () => {
    // Fermez le modal
	webSocketRef.current?.close();
    webSocketRef.current = null;
	setModalView(false);
  };

  // const updateChannel = async (relation: IChannelPassword) => {
  //   try {
  //       if (await ChannelService.checkIfSamePassword(relation))
  //         toast.success("Same password");
  //       else
  //         toast.error("HUH HUH not the same");
  //    } catch (err: any) {}}

  return (
    <>
      {!isAuth ? (
        <div className="flex flex-col items-center justify-center">
          <NavLink to="http://localhost:3000/api/auth/redir">
            <img
              src={ftLogo}
              className="logo"
              alt="42 logo"
              style={{ width: "150px", height: "150px" }}
            />
          </NavLink>
          Please, log in with 42 account
        </div>
      ) : (
          <div className=" grid grid-cols-3 gap-28">
            <div className="col-start-2 justify-self-center grid grid-rows-4 gap-10">
              <div/>
              <div>
                  <button onClick={handleOpenModal} className="w-64 h-32 bg-gray-500 text-center text-black text-4xl">PLAY</button>
                  {modalView && <WaitingGame onClose={handleCloseModal} webSocket={webSocketRef.current} />}
              </div>
              <div>
                <Link to="/chat">
                  <button className="w-64 h-32 bg-gray-500 text-center text-black text-4xl">CHAT</button>
                </Link>
              </div>
            </div>
            {/* <div className="grid grid-rows-6">
              <div className="row-start-7 w-fit -mr-2 -mb-8 ml-auto">
                <FriendList />
              </div>
            </div> */}
            {/* <div>
              <button onClick={() => updateChannel({idChannel: 1, password: "fuck"})}>Kick USer</button>
            </div> */}
          </div>
      )}
    </>
  );
};

export default Home;
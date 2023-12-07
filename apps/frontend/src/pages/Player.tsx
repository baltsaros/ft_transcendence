import { useEffect, useState } from "react";
import {  IResponseUser, IUserPlayerProfileData } from "../types/types";
import PlayerNameBox from "../components/PlayerNameBox";
import PlayerStats from "../components/PlayerStats";
import MatchHistory from "../components/MatchHistory";
import { PlayerService } from "../services/player.service";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useChatWebSocket } from "../context/chat.websocket.context";
import { RootState, store } from "../store/store";
import { fetchBlocked } from "../store/blocked/blockedSlice";
import { useSelector } from "react-redux";
import { fetchInvitations } from "../store/user/invitationSlice";
import { fetchFriends } from "../store/user/friendsSlice";
import { getUser } from "../hooks/getUser";
import { fetchChannel } from "../store/channel/channelSlice";
import { fetchAdmin } from "../store/channel/adminSlice";
import { fetchMuted } from "../store/channel/mutedSlice";
import { fetchAllUsers } from "../store/user/allUsersSlice";

export default function Player(){
  
  //state

  const [user, setUser] = useState<IResponseUser>();
  const usernameParam = useParams();
  const [_loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const webSocketService = useChatWebSocket();
  const userConnected = useSelector((state: RootState) => state.user.user);


  const getUserProfile = async () => {
    try {
      console.log("username = ", usernameParam.username);
      if (usernameParam.username) {
        const data = await PlayerService.getFullUser(usernameParam.username);
        console.log("data = ", data);
        if (data)
        {
          setUser(data);
          setLoading(false);
        }
        else {
          navigate("/")
          toast("User doesn't exists !")
        }

      }
    } catch (err: any) {
        setLoading(false);
        const error = err.response?.data.message;
        toast.error(error.toString());
      }
  };
  //behaviour

  useEffect(() => {
    if (webSocketService) {
      webSocketService.on("usernameUpdatedProfile", (payload: any) => {
        console.log("test");
        store.dispatch(fetchBlocked(userConnected!.id));
			  store.dispatch(fetchInvitations(userConnected!.username));
			  store.dispatch(fetchChannel());
			  store.dispatch(fetchAdmin(userConnected!.id));
			  store.dispatch(fetchFriends(userConnected!.username));
			  store.dispatch(fetchMuted(userConnected!.id));
			  store.dispatch(fetchAllUsers());
        getUserProfile();
      });
      return () => {
        webSocketService.off("usernameUpdatedProfile");
      };
    }
  }, []);

  useEffect(() => {
    getUserProfile();
  }, [usernameParam]) 

  //render
  if (_loading)
  {
    return (<div>Loading...</div>);
  }
  return (
      <div className="flex flex-col text-black space-y-20 flex justify-center items-center">
        <PlayerNameBox
          {...user!}
        />
        <PlayerStats
          {...user!}
        />
        <MatchHistory
          {...user!}
        />
      </div>
    );
};


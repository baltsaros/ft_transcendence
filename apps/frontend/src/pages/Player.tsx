import { useEffect, useState } from "react";
import {  IResponseUser, IUserPlayerProfileData } from "../types/types";
import PlayerNameBox from "../components/PlayerNameBox";
import PlayerStats from "../components/PlayerStats";
import MatchHistory from "../components/MatchHistory";
import { PlayerService } from "../services/player.service";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

export default function Player(){
  
  //state

  const [user, setUser] = useState<IResponseUser>();
  const usernameParam = useParams();
  const [_loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getUserProfile = async () => {
    try {
      console.log("username = ", usernameParam.username);
      if (usernameParam.username) {
        const data = await PlayerService.getFullUser(usernameParam.username);
        console.log("data = ", data);
        if (data)
        {
          // const temp = user;
          // temp.username = data.username;
          // temp.wins = data.wins;
          // temp.loses = data.loses;
          // temp.rank = data.rank;
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


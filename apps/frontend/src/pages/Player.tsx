import { useEffect, useState } from "react";
import {  IUserPlayerProfileData } from "../types/types";
import PlayerNameBox from "../components/PlayerNameBox";
import PlayerStats from "../components/PlayerStats";
import MatchHistory from "../components/MatchHistory";
import { PlayerService } from "../services/player.service";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import MatchForm from "../components/AddMatch";

export default function Player(){
  
  //state

  const [user, setUser] = useState<IUserPlayerProfileData>({
    username: "default", loses: -1, wins: -1, rank: -1});
  const usernameParam = useParams();
  const [_loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getUserProfile = async () => {
    try {
      setLoading(true);
      const data = await PlayerService.getProfile(usernameParam.username!)
      if (data)
      {
        const temp = user;
        temp.username = data.username;
        temp.wins = data.wins;
        temp.loses = data.loses;
        temp.rank = data.rank;
        setUser(temp);
        setLoading(false);
      }
      else {
        navigate("/")
        toast("User doesn't exists !")
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
  }, [user]) 

  //render
    return (
      <div className="flex flex-col text-black space-y-20 flex justify-center items-center">
        
        <PlayerNameBox
          {...user}
        />
      
        <PlayerStats
          {...user}
        />

        <MatchHistory
          {...user}
        />

        <MatchForm />
      </div>
    );
};


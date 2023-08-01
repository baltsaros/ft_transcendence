import { useState } from "react";
import { IUserPlayerProfileData } from "../types/types";
import PlayerNameBox from "../components/PlayerNameBox";
import PlayerStats from "../components/PlayerStats";
import MatchHistory from "../components/MatchHistory";

export default function Player(){
  
  //state

  const [user] = useState<IUserPlayerProfileData>(
    {username: "jvander", wins: 1, losses: 2, rank: 3});

  //behaviour


  //render
  return (
    <div className="flex flex-col text-black space-y-20 flex justify-center items-center">
      
      <PlayerNameBox
        {...user}
      />
    
      <PlayerStats
        {...user}
      />

      <MatchHistory />

    </div>
  );
};


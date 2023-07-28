import { FC } from "react";

const Player: FC = () => {
  
  //state


  //behaviour


  //render
  return (
    <div className="flex flex-col text-black space-y-20 flex justify-center items-center">
      
      <div className="bg-cyan-300 w-96 h-20 flex justify-center items-center">
        <div className="text-4xl">jvander's profile</div>
      </div>
    
      <div className="w-96 text-2xl">
          <div className="grid grid-cols-2">
              <p className="bg-green-600">Wins: 1</p>
              <p className="bg-red-600">Losses: 2</p>
          </div>
          <div>
            <p className="bg-cyan-300">Rank: 3</p>
          </div>
      </div>

      <div className="border-2 dark:border-gray-600">
        <table className="w-96 divide-y-2 divide-gray-400">
          <thead className="divide-y-2 divide-gray-400">
            <tr>
              <td>
                <div className="text-2xl text-gray-400 text-xl">  
                  <div className="bg-cyan-300 text-black text-2xl">
                    <div>MATCH HISTORY</div>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className=" text-xl grid grid-cols-3 text-center">
                  <div>Score</div>
                  <div>Win/Loss</div>
                  <div>Opponent</div>
               </div>
              </td>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-gray-400">
            <tr>
              <td>
                <div className="grid grid-cols-3 text-center">
                  <div>4 - 3</div>
                  <div className="text-green-600">Win</div>
                  <div><button className="rounded-full w-full bg-cyan-300 text-black">hdony</button></div>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className="grid grid-cols-3 text-center">
                  <div>1 - 2</div>
                  <div className="text-red-600">Loss</div>
                  <div><button className="rounded-full w-full bg-cyan-300 text-black">abuzdin</button></div>
                </div>
            </td>
            </tr>
            <tr>
              <td>
                <div className="grid grid-cols-3 text-center">
                  <div>2-  7</div>
                  <div className="text-red-600">Loss</div>
                  <div><button className="rounded-full w-full bg-cyan-300 text-black">ejoo-tho</button></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
      </div>


    </div>
  );
};

export default Player;

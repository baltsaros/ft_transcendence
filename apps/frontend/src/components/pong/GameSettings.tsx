import { ChangeEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Socket } from "socket.io-client";
import { GameSettingsData } from "../../../../backend/src/gateway/entities/gameSettingsData";
import { usePongWebSocket } from "../../context/pong.websocket.context";

const GameSettings = ({ roomId, onClose }: any) => {

	// STATE

	const [ ballSpeed, setSpeed] = useState<number>(8);
	const [ radius, setRadius] = useState<number>(10);
	const [ paddleColor, setPaddleColor ] = useState<string | null>(null);
	const [ waitingOpponent, setWaitingOpponent] = useState<boolean>(false);
	const pongWebSocketService = usePongWebSocket();
	const opponentColor = "";
	// BEHAVIOUR
	const closeModal = () => {
	  onClose();
	}

  const handleSpeed = (e: ChangeEvent<HTMLInputElement>) => {
	setSpeed(e.target.valueAsNumber);
  }

  const handleSize = (e: ChangeEvent<HTMLInputElement>) => {
    setRadius(e.target.valueAsNumber);
  }

  const handlePaddleColor = (e: ChangeEvent<HTMLInputElement>) => {
    setPaddleColor(e.target.value);
  }

  const handleReset = () => {
	setPaddleColor("white");
	setRadius(10);
	setSpeed(8);
  }

  const sendGameSettings = () => {
	if (roomId) {
		pongWebSocketService!.emit("chooseGameSettings", {data: {roomId: roomId, ballSpeed: ballSpeed, radius: radius, userPaddleColor: paddleColor}});
		setWaitingOpponent(true);
	}
};

	// RENDER
	return (
	waitingOpponent ?
	(
		<div className="fixed z-10 inset-0 bg-gray-500 bg-opacity-40 overflow-y-auto flex items-center justify-center" aria-labelledby="modal-title" role="dialog" aria-modal="true">
			<div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg w-full">
				<div className="bg-gray-400 p-4">
					<h3 className="text-3xl font-semibold leading-10 text-gray-800 text-center" id="modal-title">Waiting for your opponent's settings...</h3>
				</div>
				<div className="bg-gray-400 text-black h-24 flex items-center justify-center">
					<div className="text-2xl text-center">
						<div role="status" className="flex justify-center items-center mt-2">
						<svg aria-hidden="true" className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-200 fill-blue-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
								<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
							</svg>
							<span className="sr-only">Loading...</span>
						</div>
					</div>
				</div>
				<div className="flex justify-center bg-gray-400 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
					<Link to={"/"}>
						<button type="button" onClick={closeModal} className="mt-3 inline-flex items-center rounded-md bg-red-600 text-white px-3 py-2 text-sm font-semibold hover:bg-red-500">Cancel</button>
					</Link>
				</div>
			</div>
		</div>
	)
	:
	(
		<div className="fixed z-10 inset-0 bg-gray-500 bg-opacity-40 overflow-y-auto flex items-center justify-center" aria-labelledby="modal-title" role="dialog" aria-modal="true">
			<div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg w-full">
				<div className="bg-gray-600 p-4">
					<h3 className="text-3xl font-semibold leading-6 uppercase text-gray-300 text-center" id="modal-title">Game Settings</h3>
				</div>
				<div className="bg-gray-400 p-6 space-y-6 text-center">
				<div className="border-2 border-gray-300 rounded px-2 py-1">
					<label className="text-gray-600 mb-2 block font-bold m uppercase ">Ball speed</label>
					<input type="range" className="mb-2 w-full cursor-pointer rounded appearance-none bg-neutral-200" min="5" max="11" id="ballSpeed" onChange={handleSpeed} value={ballSpeed} />
				</div>
				<div className="text-gray-600 border-2 border-gray-300  rounded px-2 py-1">
					<label className="mb-2 block font-bold uppercase">Ball size</label>
					<input type="range" className="mb-2 w-full cursor-pointer rounded appearance-none bg-neutral-200" min="1" max="19" id="ballSize" onChange={handleSize} value={radius} />
				</div>
				<div className="border-2 border-gray-300 rounded px-2 py-1">
					<label className="text-gray-600 block mb-2 uppercase font-bold">Paddle color</label>
					<div className="grid grid-cols-6 gap-4 mb-2 ml-3">
						<div className="flex items-center">
							<input id="red-radio" type="radio" value="red" name="paddleColor" checked={paddleColor === "red"} onChange={handlePaddleColor} className="w-10 h-10 text-red-600 bg-red-500 border-gray-300 rounded focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2"/>
						</div>
						<div className="flex items-center">
							<input id="green-radio" type="radio" value="green" name="paddleColor" checked={paddleColor === "green"} onChange={handlePaddleColor} className="w-10 h-10 text-green-600 bg-green-500 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2"/>
						</div>
						<div className="flex items-center">
							<input id="purple-radio" type="radio" value="purple" name="paddleColor" checked={paddleColor === "purple"} onChange={handlePaddleColor} className="w-10 h-10 text-purple-600 bg-purple-500 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2"/>
						</div>
						<div className="flex items-center">
							<input id="teal-radio" type="radio" name="paddleColor" value="teal" checked={paddleColor === "teal"} onChange={handlePaddleColor} className="w-10 h-10 text-teal-600 bg-teal-500 border-gray-300 rounded focus:ring-teal-500 dark:focus:ring-teal-600 dark:ring-offset-gray-800 focus:ring-2"/>
						</div>
						<div className="flex items-center">
							<input id="yellow-radio" type="radio" name="paddleColor" value="yellow" checked={paddleColor === "yellow"} onChange={handlePaddleColor} className="w-10 h-10 text-yellow-400 bg-yellow-500 border-gray-300 rounded focus:ring-yellow-500 dark:focus:ring-yellow-600 dark:ring-offset-gray-800 focus:ring-2"/>
						</div>
						<div className="flex items-center">
							<input id="orange-radio" type="radio" name="paddleColor" value="orange" checked={paddleColor === "orange"} onChange={handlePaddleColor} className="w-10 h-10 text-orange-500 bg-orange-500 border-gray-300 rounded focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-800 focus:ring-2"/>
						</div>
					</div>
				</div>
				</div>
				<div className="bg-gray-600 p-4 grid grid-cols-5 gap-4">
					<Link to={"/"}>
						<button onClick={closeModal} className="col-span-1 px-4 py-2 text-white font-semibold bg-red-600 hover:bg-red-500  transition duration-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400">Cancel</button>
					</Link>
					<button onClick={handleReset} className="col-start-3 col-span-1 px-4 py-2 text-white font-semibold bg-yellow-500 hover:bg-yellow-400  transition duration-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400">Reset</button>
					<button
					onClick={() => { sendGameSettings(); }}
					className={`col-start-5 col-span-1 px-4 py-2 text-white font-semibold ${paddleColor ? 'bg-green-500 hover:bg-green-400' : 'bg-gray-400 cursor-not-allowed'} transition duration-300 rounded shadow-sm focus:outline-none focus:ring-2 ${paddleColor ? 'focus:ring-green-400' : ''}`}
					disabled={!paddleColor}>Submit</button>
				</div>
			</div>
		</div>
		)
	);
};

export default GameSettings;
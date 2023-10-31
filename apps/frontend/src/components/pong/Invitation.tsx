import { ChangeEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Socket } from "socket.io-client";

const GameInvitation = ({ onClose}: any) => {

	// STATE

	// BEHAVIOUR


	// RENDER
	return (
		<div className="fixed z-10 inset-0 bg-gray-500 bg-opacity-40 overflow-y-auto flex items-center justify-center" aria-labelledby="modal-title" role="dialog" aria-modal="true">
			<div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg w-full">
				<div className="bg-gray-400 p-4">
					<h3 className="text-3xl font-semibold leading-10 text-gray-800 text-center" id="modal-title">Invitation for a game</h3>
				</div>
				<div className="bg-gray-400 px-4 py-3 text-left">
					<Link to={"/"}>
						<button type="button" className="inline-flex rounded-md items-center bg-red-600 text-white px-3 py-2 text-sm font-semibold hover:bg-red-500">Decline</button>
					</Link>
				</div>
				<div className="bg-gray-400 px-4 py-3 text-right">
					<Link to={"/"}>
						<button type="button" className="inline-flex rounded-md items-center bg-red-600 text-white px-3 py-2 text-sm font-semibold hover:bg-green-500">Accept</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default GameInvitation;
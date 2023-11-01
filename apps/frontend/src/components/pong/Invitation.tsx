import { ChangeEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import { AuthService } from "../../services/auth.service";
import { useChatWebSocket } from "../../context/chat.websocket.context";
import { usePongWebSocket } from "../../context/pong.websocket.context";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const GameInvitation = ({ onClose, sender}: any) => {

	// STATE
	const chatWebSocketService = useChatWebSocket();
	const pongWebSocketService = usePongWebSocket();
	const navigate = useNavigate();

	// BEHAVIOUR
	const updateInGameStatus = async () => {
		const userUpdate = await AuthService.updateStatus("inGame");
		chatWebSocketService!.emit("updateStatus", {data: {userUpdate}});
	};

	const updateOnlineStatus = async () => {

		const userUpdate = await AuthService.updateStatus("online");
		chatWebSocketService!.emit("updateStatus", {data: {userUpdate}});
	};

	const handleDecline = () => {
		pongWebSocketService!.emit('cancelInvitation', {data : {player: sender}});
		onClose();
	}

	const handleAccept = () => {
		pongWebSocketService!.emit('inviteMatchmaking', {data : {sender: sender}});
	};

	useEffect(() => {
			pongWebSocketService!.on('inviteMatchmakingSuccess', (data: { roomId: string}) => {
				updateInGameStatus();
				navigate(`/game/${data.roomId}`);
			});

			pongWebSocketService!.on('invitationCanceled', () => {
					toast.error("Invitation declined.");
					updateOnlineStatus();
					onClose();
			});

			return () => {
				// pongWebSocketService!.emit('cancelInvitation', {data : {player: sender}});
				pongWebSocketService?.off('inviteMatchmakingSuccess');
				pongWebSocketService?.off('invitationCanceled');
				pongWebSocketService!.emit('cancelInvitation', {data : {player: sender}});
		  };
	}, []);

	// useEffect(() => {
	// 	const handleBeforeUnload = () => {
	// 	  // Empêcher la fermeture immédiate de la page
	// 	//   event.preventDefault();
	// 	  // Envoyer un événement au serveur WebSocket pour avertir l'autre utilisateur
	// 		pongWebSocketService!.emit('cancelInvitation', {data : {player: sender}});
	// 	  // Continuer le rafraîchissement après un court délai pour que l'événement soit envoyé
	// 	//   setTimeout(() => {
	// 	// 	window.location.reload();
	// 	//   }, 200); // Choisissez un délai qui fonctionne pour votre cas

	// 	  // Vous puvez également personnaliser le message affiché par le navigateur lors de la fermeture
	// 	//   event.returnValue = 'Vous quittez la page.';
	// 	  // Supprimer le gestionnaire d'événements lorsque le composant est démonté
	// 	  return () => {
	// 		window.removeEventListener('beforeunload', handleBeforeUnload);
	// 	  };
	// 	};

	// 	// Ajouter le gestionnaire d'événements à l'événement beforeunload
	// 	window.addEventListener('beforeunload', handleBeforeUnload);
	
	// 	// Assurez-vous de supprimer le gestionnaire d'événements lorsque le composant est démonté
	// 	return () => {
	// 	  window.removeEventListener('beforeunload', handleBeforeUnload);
	// 	};
	//   }, []);
	

	// RENDER
	return (
		<div className="fixed z-10 inset-0 bg-gray-500 bg-opacity-40 overflow-y-auto flex items-center justify-center" aria-labelledby="modal-title" role="dialog" aria-modal="true">
			<div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg w-full">
				<div className="bg-gray-400 p-4">
					<h3 className="text-3xl font-semibold leading-10 text-gray-800 text-center" id="modal-title">Invitation for a game</h3>
				</div>
				<div className="bg-gray-400 px-4 py-3 text-left">
						<button type="button" onClick={handleDecline} className="inline-flex rounded-md items-center bg-red-600 text-white px-3 py-2 text-sm font-semibold hover:bg-red-500">Decline</button>
				</div>
				<div className="bg-gray-400 px-4 py-3 text-right">
						<button type="button" onClick={handleAccept} className="inline-flex rounded-md items-center bg-green-600 text-white px-3 py-2 text-sm font-semibold hover:bg-green-500">Accept</button>
				</div>
			</div>
		</div>
	);
};

export default GameInvitation;
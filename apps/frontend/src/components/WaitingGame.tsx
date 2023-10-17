import { useEffect } from "react";
import { usePongWebSocket } from "../context/PongWebSocketContext";

interface ModalProp {
    onClose: () => void; // Define the type of onClose prop as a function that returns void & takes no arg
  }

const WaitingGame = ({onClose}: any) => {

    // STATE

	// Créez une instance du service WebSocket
	// Remplacez 'username' par le nom d'utilisateur approprié
	const webSocket = usePongWebSocket();


	// BEHAVIOUR

	useEffect(() => {

		// Lorsque le composant est monté, lancez l'événement "launchMatchmaking"
		// Le service WebSocket gère la connexion WebSocket et l'événement
		// "launchMatchmaking" sera intercepté côté serveur pour gérer la logique de matchmaking.
		webSocket.emit('launchMatchmaking', {}); // Vous pouvez envoyer des données en fonction de vos besoins

		webSocket.on('testMessage', (data: { content: string }) => {
			console.log(data.content);
		  });
		webSocket.on('createdPongRoom', (data: { roomId: string }) => {
		  console.log(`Room created with ID: ${data.roomId}`); // Mettez à jour l'ID de la salle dans l'état local
		});

		// Gestion des événements du serveur pour la mise en correspondance
		webSocket.on('matchmakingSuccess', (data: { roomId: string }) => {
		  console.log(`Matchmaking successful. Room ID: ${data.roomId}`);
		});

		webSocket.on('matchmakingError', (data: { message: string }) => {
		  console.error(`Matchmaking error: ${data.message}`);
		});

		// N'oubliez pas de nettoyer la connexion WebSocket lorsque le composant est démonté
		return () => {
		  webSocket.disconnect();
		};
	  }, [webSocket]);

    const closeModal = () => {
        onClose();
      }
    //render
    return (
        <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-60 transition-opacity"></div>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-gray-500 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <h3 className="text-2xl text-center items-center font-semibold leading-6 text-gray-900" id="modal-title">Waiting for player...</h3>
                    </div>
                </div>
                <div className="bg-gray-500 text-black h-12">
                        <div className="text-2xl text-center">
                            <div role="status">
                                <svg aria-hidden="true" className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                </div>
                <div className="bg-gray-400 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button type="button" onClick={closeModal} className="mt-3 inline-flex items-center w-full rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
                </div>
            </div>
          </div>
        </div>
      </div>
        );
    }

    export default WaitingGame;
    
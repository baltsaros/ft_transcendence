import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { ChatWebSocketProvider } from "./context/chat.websocket.context.tsx";
import { PongWebSocketProvider } from "./context/pong.websocket.context.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <ChatWebSocketProvider>
    	<PongWebSocketProvider>
			<App />
    	</PongWebSocketProvider>
    </ChatWebSocketProvider>
    <ToastContainer position="bottom-left" autoClose={2000} />
  </Provider>
);

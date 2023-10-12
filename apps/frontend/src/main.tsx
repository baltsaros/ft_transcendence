import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { ChatWebSocketProvider } from "./context/ChatWebSocketContext.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <ChatWebSocketProvider>
    	<App />
    </ChatWebSocketProvider>
    <ToastContainer position="bottom-left" autoClose={2000} />
  </Provider>
);

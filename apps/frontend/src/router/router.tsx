import { createBrowserRouter } from "react-router-dom";
import Layout from "../pages/Layout";
import ErrorPage from "../pages/ErrorPage";
import Home from "../pages/Home";
import Player from "../pages/Player";
import ProfileEdit from "../pages/ProfileEdit";
import { ProtectedRoute } from "../components/ProtectedRoute";
import Chat from "../pages/ChatPage";
import Auth from "../pages/Auth";
import GamePage from "../pages/GamePage";
import { SelectedChannelProvider } from "../context/selectedChannel.context";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "player/:username",
        element: (
          <ProtectedRoute>
            <Player />
          </ProtectedRoute>
        ),
      },
      {
        path: "edit",
        element: (
          <ProtectedRoute>
            <ProfileEdit />
          </ProtectedRoute>
        ),
      },
      {
        path: "chat",
        element: (
          <ProtectedRoute>
            <SelectedChannelProvider>
            	<Chat />
            </SelectedChannelProvider>
          </ProtectedRoute>
        ),
      },
	  {
		path: "game/:roomId",
		element: (
		  <ProtectedRoute>
				<GamePage />
		  </ProtectedRoute>
		),
	  },
      {
        path: "auth",
        element: <Auth />
      },
      {
        path: "*",
        element: <ErrorPage />
      },
    ],
  },
]);

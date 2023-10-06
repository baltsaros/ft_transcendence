import { createBrowserRouter } from "react-router-dom";
import Layout from "../pages/Layout";
import ErrorPage from "../pages/ErrorPage";
import Home from "../pages/Home";
import Player from "../pages/Player";
import Profile from "../pages/Profile";
import { ProtectedRoute } from "../components/ProtectedRoute";
import Chat from "../pages/ChatPage";
import Auth from "../pages/Auth";

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
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "chat",
        element: (
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        ),
      },
      {
        path: "auth",
        element: <Auth />
      },
    ],
  },
]);

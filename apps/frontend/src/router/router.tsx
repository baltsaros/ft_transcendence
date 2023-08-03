import { createBrowserRouter } from "react-router-dom";
import Layout from "../pages/Layout";
import ErrorPage from "../pages/ErrorPage";
import Home from "../pages/Home";
import Auth from "../pages/Auth";
import Player from "../pages/Player";
import Redir from "../pages/Redir";

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
        path: "auth",
        element: <Auth />,
      },
      {
        path: "player",
        element: <Player />,
      },
      {
        path: "redir",
        element: <Redir />,
      },
    ],
  },
]);

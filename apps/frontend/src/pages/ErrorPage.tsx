import { FC } from "react";
import { Link } from "react-router-dom";

const ErrorPage: FC = () => {
  return (
    <div>
      ErrorPage
      <Link to={"/"}>Home</Link>
    </div>
  );
};

export default ErrorPage;

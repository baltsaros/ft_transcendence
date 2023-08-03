import { FC } from "react";
import ftLogo from "../assets/42_Logo.svg";
import { NavLink } from "react-router-dom";

const Redir: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <NavLink to={"http://localhost:3000/api/auth/redir"}>
        <img
          src={ftLogo}
          className="logo"
          alt="42 logo"
          style={{ width: "150px", height: "150px" }}
        />
      </NavLink>
      Please, log in with 42 account
    </div>
  );
};

export default Redir;

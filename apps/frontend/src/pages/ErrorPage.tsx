import { FC } from "react";
import errorMeme from "../assets/what_are_you_trying_to_accomplish.jpg"

const ErrorPage: FC = () => {
  return (
      <div className="mt 20 flex flex-col h-screen items-center justify-center align-middl gap-5">
          <img className="w-1/2" src={errorMeme} alt="Not found" />
      </div>
  );
};

export default ErrorPage;

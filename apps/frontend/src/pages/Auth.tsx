import { FC, useState } from "react";
import { AuthService } from "../services/auth.service";
import { toast } from "react-toastify";
import { setTokenToLocalStorage } from "../helpers/localstorage.helper";
import { useAppDispatch } from "../store/hooks";
import { login } from "../store/user/userSlice";
import { useNavigate } from "react-router-dom";

const Auth: FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const registrationHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const data = await AuthService.registration({
        username,
        email,
        password,
      });
      if (data) {
        toast.success("Account was successfully created!");
        setIsLogin(!isLogin);
        navigate("/");
      }
    } catch (err: any) {
      const error = err.response?.data.message;
      toast.error(error.toString());
    }
  };

  const loginHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const data = await AuthService.login({ username, email, password });
      if (data) {
        setTokenToLocalStorage("token", data.token);
        dispatch(login(data));
        toast.success("Access granted ;)");
        navigate("/");
      }
    } catch (err: any) {
      const error = err.response?.data.message;
      toast.error(error.toString());
    }
  };

  return (
    <div>
      <h1>{isLogin ? "Login" : "Registration"}</h1>

      <form onSubmit={isLogin ? loginHandler: registrationHandler}>
        <input
          type="text"
          className="input"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        {!isLogin && (
          <input
            type="text"
            className="input"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        )}
        <input
          type="password"
          className="input"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn btn-green mx-auto">Submit</button>
      </form>
      <div>
        {isLogin ? (
          <button onClick={() => setIsLogin(!isLogin)}>
            {" "}
            You don't have an account?
          </button>
        ) : (
          <button onClick={() => setIsLogin(!isLogin)}>
            {" "}
            Already have an account?
          </button>
        )}
      </div>
    </div>
  );
};

export default Auth;

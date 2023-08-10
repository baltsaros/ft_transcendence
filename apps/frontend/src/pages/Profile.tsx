import { useAppSelector } from "../store/hooks";
import { RootState } from "../store/store";
import { FC, useState } from "react";
import { AuthService } from "../services/auth.service";
import { toast } from "react-toastify";
import { useAppDispatch } from "../store/hooks";
import { useNavigate } from "react-router-dom";
import { login } from "../store/user/userSlice";

const Profile: FC = () => {
  const user = useAppSelector((state: RootState) => state.user.user);
  const [username, setUsername] = useState<string>("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const nameUpdateHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (username == user?.username) {
        toast.error("Username cannot be the same");
        return;
      }
      const tmp = {
        username: username,
        avatar: user ? user.avatar : "",
        id: user ? user.id : 0,
        intraId: user ? user.intraId : 0,
        intraToken: user ? user.intraToken : "",
        email: user ? user.email : "",
      };
      console.log(tmp);
      const data = await AuthService.update(tmp);
      if (data) {
        toast.success("Username was successfully update!");
        // console.log(data.username);
        dispatch(login(data));
        navigate("/");
        window.location.reload();
      }
    } catch (err: any) {
      const error = err.response?.data.message;
      toast.error(error.toString());
    }
  };

  // const loginHandler = async (e: React.FormEvent<HTMLFormElement>) => {
  //   try {
  //     e.preventDefault();
  //     const data = await AuthService.login({ username, email, password });
  //     if (data) {
  //       setTokenToLocalStorage("token", data.access_token);
  //       dispatch(login(data));
  //       toast.success("Access granted ;)");
  //       navigate("/");
  //     }
  //   } catch (err: any) {
  //     const error = err.response?.data.message;
  //     toast.error(error.toString());
  //   }
  // };

  return (
    <div>
      <form onSubmit={nameUpdateHandler}>
        <input
          type="text"
          className="input"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        {/* <input
          type="password"
          className="input"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        /> */}
        <button className="btn btn-green mx-auto">Submit</button>
      </form>
    </div>
  );
};

export default Profile;

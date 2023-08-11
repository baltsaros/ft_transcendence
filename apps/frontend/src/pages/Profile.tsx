import { useAppSelector } from "../store/hooks";
import { RootState } from "../store/store";
import { FC, useState } from "react";
import { AuthService } from "../services/auth.service";
import { toast } from "react-toastify";
import { useAppDispatch } from "../store/hooks";
import { NavLink, useNavigate } from "react-router-dom";
import { login } from "../store/user/userSlice";

const Profile: FC = () => {
  const user = useAppSelector((state: RootState) => state.user.user);
  const [username, setUsername] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const updateHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (username == "") {
        toast.error("Username field cannot be empty");
        return;
      }
      else if (username == user?.username) {
        toast.error("Username cannot be the same");
        return;
      }
      const tmp = {
        username: username,
        avatar: avatar.length > 0 ? avatar : (user ? user.avatar : ""),
        id: user ? user.id : 0,
        intraId: user ? user.intraId : 0,
        intraToken: user ? user.intraToken : "",
        email: user ? user.email : "",
      };
      console.log(tmp);
      const data = await AuthService.update(tmp);
      if (data) {
        toast.success("User information was successfully updated!");
        navigate("/");
        window.location.reload();
      }
    } catch (err: any) {
      const error = err.response?.data.message;
      toast.error(error.toString());
    }
  };

  const uploadImage = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!avatar) return ;
      toast.success("File was successfully added!");
      // setAvatar(e.target.value);
  };

  return (
    <div className="mt-8 w-3/5 mx-auto bg-gray-500 text-black uppercase">
      <h2 className="bg-cyan-300 w-full mb-2 p-5 tracking-wider text-lg">
        Profile creation
      </h2>
      <h2 className="bg-gray-500 w-full mb-4 p-5 tracking-wider"></h2>
      <div className="bg-cyan-300 flex justify-start mb-2 p-5 space-x-4 items-center">
        <h3 className="pl-2 pr-6">Enter username:</h3>
        <form className="">
          <input
            type="text"
            className="input"
            // placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </form>
        {/* <input
              type="password"
              className="input"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            /> */}
      </div>
      <div className="bg-gray-500 flex flex-col justify-center mb-4 items-center">
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt="ImageError"
            className="rounded-full h-16 w-16 overflow-hidden mt-2"
          />
        ) : (
          "AVATAR"
        )}
        <div className="bg-cyan-300 flex w-full justify-center p-2 mt-4">Upload avatar</div>
      </div>
      <div className="flex flex-row items-end justify-between">
        <form onSubmit={updateHandler}>
          <button className="btn btn-gray">Ok</button>
        </form>
        <NavLink to={"/"}>
          <button className="btn btn-gray">Cancel</button>
        </NavLink>
      </div>
    </div>
  );
};

export default Profile;

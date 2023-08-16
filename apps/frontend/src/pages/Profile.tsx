import { useAppSelector } from "../store/hooks";
import { RootState } from "../store/store";
import { ChangeEvent, FC, useState } from "react";
import { AuthService } from "../services/auth.service";
import { toast } from "react-toastify";
import { useAppDispatch } from "../store/hooks";
import { NavLink, useNavigate } from "react-router-dom";
import { login } from "../store/user/userSlice";
import axios from 'axios';

const Profile: FC = () => {
  const user = useAppSelector((state: RootState) => state.user.user);
  const [avatar, setAvatar] = useState<any>({source: ""});
  const [username, setUsername] = useState<string>("");
  const [filename, setFilename] = useState<string>("");
  const [file, setFile] = useState<any>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const updateHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (username == "") {
        toast.error("Username field cannot be empty");
        return;
      } else if (username == user?.username) {
        toast.error("Username cannot be the same");
        return;
      }
      const tmp = {
        username: username,
        avatar: filename.length > 0 ? filename : (user ? user.avatar : ""),
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

  const uploadImage = async () => {
    console.log(file);
    const upload = await AuthService.uploadAvatar(file, user?.id.toString() || '0');
    // console.log('upload image' + upload);
    console.log(upload.data.filename);
    // if (upload.data.filename)
    const base64 = await AuthService.getAvatar(upload.data.filename);
    // console.log(base64);
    setAvatar({source: "data:;base64," + base64});
    // setAvatar('uploads/avatar/' + upload.data.filename)
    toast.success("File was successfully added!");
    // setAvatar(e.target.value);
  };

  const getFile = (file: ChangeEvent) => {
    const { files } = file.target as HTMLInputElement;
    console.log("get file");
    if (files && files.length != 0) {
      if (files[0].size > 3 * 1000000) {
        toast.error("Image size cannot be more than 3 mb. Chose another file!");
        return ;
      }
      if (files[0].type != "image/png" && files[0].type != "image/jpeg") {
        toast.error("Image can be only of png/jpeg format. Chose another file!");
        return ;
      }
      setFile(files[0]);
    }
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
        {avatar.source.length ? (
          <img
            src={avatar.source}
            alt="ImageError"
            className="rounded-full h-16 w-16 overflow-hidden mt-2"
          />
          ) : (
          <img
            src={user.avatar}
            alt="ImageError"
            className="rounded-full h-16 w-16 overflow-hidden mt-2"
          />
        )}
        <div className="bg-cyan-300 flex flex-col w-full justify-center p-2 mt-4">
          <form onSubmit={(e) => e.preventDefault()}>
            <input type="file" onChange={getFile} />
            <button onClick={uploadImage}>Upload avatar</button>
          </form>
        </div>
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

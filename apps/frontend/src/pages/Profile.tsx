import { ChangeEvent, FC, useState } from "react";
import { AuthService } from "../services/auth.service";
import { toast } from "react-toastify";
import { useAppDispatch } from "../store/hooks";
import { NavLink, useNavigate } from "react-router-dom";
import { getUser } from "../hooks/getUser";

const Profile: FC = () => {
  const user = getUser();
  const [avatar, setAvatar] = useState<string>("");
  const [filename, setFilename] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [twoFA, setTwoFA] = useState<boolean>(user ? user.twoFactorAuth : false);
  const [file, setFile] = useState<any>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const updateHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      // if (username == "") {
      //   toast.error("Username field cannot be empty");
      //   return;
      if (username == user?.username) {
        toast.error("Username cannot be the same");
        return;
      }
      const tmp = {
        username: username == "" ? (user ? user.username : "") : username,
        avatar: filename.length > 0 ? filename : user ? user.avatar : "",
        id: user ? user.id : 0,
        intraId: user ? user.intraId : 0,
        intraToken: user ? user.intraToken : "",
        email: user ? user.email : "",
        twoFactorAuth: twoFA,
        secret: user ? user.secret : "",
        rank: user ? user.rank : 0,
        status: user ? user.status : "",
        wins: user ? user.wins : 0,
        loses: user ? user.loses : 0,
        createdAt: user ? user.createdAt : new Date(),
      };
      if (twoFA && !(user?.twoFactorAuth)) {
        tmp.secret = await AuthService.generateSecret();
      }
      // console.log(tmp);
      // console.log("filename: " + filename);
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
    const upload = await AuthService.uploadAvatar(
      file,
      user?.id.toString() || "0"
    );
    // console.log('upload image' + upload);
    // console.log(upload.data.filename);
    setFilename(upload.data.filename);
    // if (upload.data.filename)
    const base64 = await AuthService.getAvatar(upload.data.filename);
    setAvatar("data:;base64," + base64);
    // console.log(base64);
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
        return;
      }
      if (files[0].type != "image/png" && files[0].type != "image/jpeg") {
        toast.error(
          "Image can be only of png/jpeg format. Chose another file!"
        );
        return;
      }
      setFile(files[0]);
    }
  };

  const handleCheckBox = () => {
    setTwoFA(!twoFA);
  };

  return (
    <div className="mt-8 w-3/5 mx-auto bg-gray-500 text-black uppercase">
      <h2 className="bg-cyan-300 w-full mb-2 p-5 tracking-wider text-lg">
        Profile creation
      </h2>
      <h2 className="bg-gray-500 w-full mb-4 p-5 tracking-wider"></h2>
      <div className="bg-cyan-300 flex justify-start p-5 space-x-4 items-center">
        <h3 className="pl-2 pr-6">Enter username:</h3>
        <form className="">
          <input
            type="text"
            className="input"
            // placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </form>
      </div>
      <div className="bg-cyan-300 flex justify-start mb-2 p-5 space-x-4 items-center">
        <h3 className="pl-2 pr-6">Two-factor authentication:</h3>
        <form className="">
            <input
            type="checkbox"
            className="input"
            checked={twoFA}
            onChange={handleCheckBox}
          />
        </form>
      </div>
      <div className="bg-gray-500 flex flex-col justify-center mb-4 items-center">
        {avatar.length ? (
          <img
            src={avatar}
            alt="ImageError"
            className="rounded-full h-16 w-16 overflow-hidden mt-2"
          />
        ) : (
          "[AVATAR]"
        )}
        <div className="bg-cyan-300 flex flex-col w-full justify-center p-2 mt-4">
          <form className="flex flex-col items-center object-center" onSubmit={(e) => e.preventDefault()}>
            <input type="file" onChange={getFile} />
            <button className="flex justify-center object-center mt-2 btn btn-gray" onClick={uploadImage}>Upload</button>
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

import { ChangeEvent, FC, useState } from "react";
import { AuthService } from "../services/auth.service";
import { toast } from "react-toastify";
import { useAppDispatch } from "../store/hooks";
import { Link, useNavigate } from "react-router-dom";
import { getUser } from "../hooks/getUser";

const ProfileEdit: FC = () => {
  const user = getUser();
  const [avatar, setAvatar] = useState<string>("");
  const [filename, setFilename] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [twoFA, setTwoFA] = useState<boolean>(
    user ? user.twoFactorAuth : false
  );
  const [file, setFile] = useState<any>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const updateHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
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
      if (twoFA && !user?.twoFactorAuth) {
        tmp.secret = await AuthService.generateSecret();
      }
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
    setFilename(upload.data.filename);
    const base64 = await AuthService.getAvatar(upload.data.filename);
    setAvatar("data:;base64," + base64);
    toast.success("File was successfully added!");
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
		<div className="mt-8 w-3/5 mx-auto bg-gray-400 text-black uppercase rounded-lg">
			<h2 className="bg-gray-500 w-full p-4 tracking-wider text-lg rounded-t-lg">
				 Edit Profile Settings
			</h2>
			<div className="bg-gray-300 flex justify-start p-4 space-x-4 items-center">
				<h3 className="font-semibold">Enter a new username :</h3>
				<form className="">
					<input
						type="text"
						className="input text-gray-600 bg-gray-400 border border-gray-500 rounded p-2 focus:outline-none focus:border-gray-500"
						onChange={(e) => setUsername(e.target.value)}
					/>
				</form>
			</div>
			<div className="bg-gray-300 flex justify-start p-4 space-x-4 items-center">
				<h3 className="font-semibold">Two-factor Authentication :</h3>
				<form className="">
					<input
						type="checkbox"
						className="form-checkbox text-gray-600"
						checked={twoFA}
						onChange={handleCheckBox}
					/>
				</form>
			</div>
			<div className="bg-gray-400 flex flex-col justify-center items-center ">
				<div className="bg-gray-300 flex flex-col w-full items-center justify-center  mb-4 rounded-lg">
					{avatar.length ? (
						<img
							src={avatar}
							alt="Avatar"
							className="rounded-full h-16 w-16 object-cover mt-2"
						/>
						) : (
					<h2 className="bg-gray-500 w-full mb-2 p-4 tracking-wider text-lg">
					Choose a new profile image
					</h2>
					)}
					<form
						className="flex flex-col items-center mt-3 object-center"
						onSubmit={(e) => e.preventDefault()}
					>
						<input
							type="file"
							onChange={getFile}
							className="input border border-gray-500 bg-gray-400 text-gray-600 rounded p-2 mb-2 focus:outline-none focus:border-gray-500"
						/>
						<button
							className="btn btn-gray mb-3"
							onClick={uploadImage}
						>
							Upload
						</button>
					</form>
				</div>
			</div>
			<div className="flex flex-row justify-between p-4 rounded-b-lg">
				<Link to="/">
					<button className="btn btn-red text-white rounded-md">Cancel</button>
				</Link>
				<form onSubmit={updateHandler}>
					<button className="btn btn-green text-white rounded-md">Submit</button>
				</form>
			</div>
		</div>
	);
};

export default ProfileEdit;

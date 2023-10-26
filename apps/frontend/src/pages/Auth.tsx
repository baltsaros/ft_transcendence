import { FC, SyntheticEvent, useEffect, useState } from "react";
import { AuthService } from "../services/auth.service";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const Auth: FC = () => {
  const [QrDataUrl, setQrDataUrl] = useState("");
  const [Code, setCode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const intraId = Cookies.get("intraId");
        const QrCode = await AuthService.generateQrCode(
          intraId ? intraId.toString() : ""
        );
        setQrDataUrl(QrCode);
      } catch (error) {
        console.error("Fetch error: ", error);
      }
    };
    fetchData();
  }, []);

  const handleCode = async (e: SyntheticEvent) => {
    e.preventDefault();
    const intraId = Cookies.get("intraId");
    try {
      const response = await axios.post("http://localhost:3000/api/auth/2fa", {
        code: Code,
        intraId: intraId,
      });
      if (response.data.valid) {
        toast.success("Your code was accepted!");
        Cookies.set("jwt_token", response.data.jwt, {
          secure: true,
          sameSite: "none",
        });
        navigate("/");
        window.location.reload();
      } else toast.error("Your code was not accepted. Try again.");
    } catch (error) {
      toast.error("Your code was not accepted. Try again.");
      console.error("Post request error");
    }
  };

  return (
    <div className="flex flex-col mt-8 justify-items-center">
      <p className="text-lg">
        Scan the QR code in your Google Authenticator app
      </p>
      <div className="flex justify-center mb-4 mt-4">
        <img src={QrDataUrl} alt="QR Code" />
      </div>

      <form className="flex justify-center" onSubmit={handleCode}>
        <input
          type="text"
          className="text-black"
          value={Code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button className="p-2 btn-gray text-black" type="submit">
          Confirm
        </button>
      </form>
    </div>
  );
};

export default Auth;

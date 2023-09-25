import { FC, useEffect, useState } from "react";
import { AuthService } from "../services/auth.service";
import { toast } from "react-toastify";
import { setTokenToLocalStorage } from "../helpers/localstorage.helper";
import { useAppDispatch } from "../store/hooks";
import { login } from "../store/user/userSlice";
import { useNavigate } from "react-router-dom";
import { getUser } from "../hooks/getUser";

const Auth: FC = () => {
  const user = getUser();
  const [QrDataUrl, setQrDataUrl] = useState("");
  const [Code, setCode] = useState("");
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const QrCode = await AuthService.generateQrCode();
        setQrDataUrl(QrCode);
      } catch (error) {
        console.error("Fetch error: ", error);
      }
    };
      fetchData();
  }, []);

  const handleCode = async () => {
    console.log("handle");
  }

  return (
    <div>
      <div>
        <p>Scan the QR code on your authenticator app</p>
        <img src={QrDataUrl} alt="QR Code"/>
      </div>

      <form onSubmit={handleCode}>
        <input type="text"
        value={Code}
        onChange={(e) => setCode(e.target.value)}/>
        <button className="btn-gray" type="submit">Confirm</button>
      </form>
    </div>
  );
};

export default Auth;

import axios from "./axios";
import { useAuth } from "./useAuth";

const RefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.get("/renew", {
      withCredentials: true,
    });
    setAuth((prev) => {
      console.log(JSON.stringify(prev));
      console.log(response.data.accessToken);
      return { ...prev, accessToken: response.data.accessToken };
    });
    return response.data.accessToken;
  };
  return refresh;
};

export default RefreshToken;

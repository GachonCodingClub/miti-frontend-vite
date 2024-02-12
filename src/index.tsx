import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Screen } from "./components/Screen";
import { ROUTES } from "./routes";

export default function MITI() {
  const userToken = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    console.log(userToken);
    if (userToken) {
      navigate(ROUTES.MEETING_LIST);
    } else {
      navigate(ROUTES.SIGN_IN);
    }
  }, [userToken, navigate]);

  return (
    <Screen>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <img src="/images/MITI.png" alt="MITI" width={95} height={32} />
      </div>
    </Screen>
  );
}

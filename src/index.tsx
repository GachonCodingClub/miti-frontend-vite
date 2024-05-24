import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Screen } from "./components/styles/Screen";
import { ROUTES } from "./routes";

export const MITISVG = () => {
  return (
    <svg
      width="95"
      height="24"
      viewBox="0 0 66 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.971363 0.727272H7.93727L13.8464 15.1364H14.1191L20.0282 0.727272H26.9941V24H21.5168V9.70455H21.3236L15.7327 23.8523H12.2327L6.64182 9.625H6.44864V24H0.971363V0.727272ZM35.4876 0.727272V24H29.8626V0.727272H35.4876ZM37.6175 5.29545V0.727272H57.288V5.29545H50.2311V24H44.6857V5.29545H37.6175ZM65.0201 0.727272V24H59.3951V0.727272H65.0201Z"
        fill="#FF7152"
      />
    </svg>
  );
};

export default function MITI() {
  const navigate = useNavigate();

  useEffect(() => {
    const userToken = localStorage.getItem("token");
    if (userToken) {
      navigate(ROUTES.MEETING_LIST);
    } else {
      navigate(ROUTES.SIGN_IN);
    }
  }, [navigate]);

  return (
    <Screen>
      <div className="flex justify-center items-center h-screen">
        <MITISVG />
      </div>
    </Screen>
  );
}

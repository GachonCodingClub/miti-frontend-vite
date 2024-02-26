import { useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { NewAlert } from "../atoms";
import { SnackBar } from "./styles/Button";

const GlobalAlert = () => {
  const location = useLocation();
  const showAlert = useRecoilValue(NewAlert);
  const shouldShowAlert =
    showAlert && !location.pathname.startsWith("/meeting-chat-room/");

  return shouldShowAlert ? (
    <SnackBar text="새 알림이 있어요" onClick={() => {}} />
  ) : null;
};

export default GlobalAlert;

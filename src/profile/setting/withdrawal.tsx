import { useNavigate } from "react-router-dom";
import { ArrowbackIcon } from "../../components/styles/Icons";
import { TopBar } from "../../components/TopBar";
import { PaddingScreen } from "../../components/styles/Screen";

export default function Withdrawal() {
  const navigate = useNavigate();
  return (
    <>
      <TopBar
        title="회원 탈퇴"
        leftIcon={<ArrowbackIcon onClick={() => navigate(-1)} />}
      />
      <PaddingScreen>
        <h1>진짜 탈퇴함?</h1>
      </PaddingScreen>
    </>
  );
}

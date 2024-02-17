import { ArrowbackIcon } from "../../components/styles/Icons";
import { TabBar } from "../../components/TabBar";
import { TopBar } from "../../components/TopBar";
import { useNavigate } from "react-router-dom";
import {
  SettingScreen,
  SettingButtonBox,
  SettingButton,
  LogoutButton,
  LogoutFrame,
} from "../styles/settingComponents";

export default function Setting() {
  const navigate = useNavigate();
  return (
    <>
      <TopBar
        title="설정"
        leftIcon={<ArrowbackIcon onClick={() => navigate(-1)} />}
      />
      <SettingScreen>
        <SettingButtonBox>
          <SettingButton to="/setting/edit">기본 프로필 수정</SettingButton>
          <SettingButton to="/setting/withdrawal">회원 탈퇴하기</SettingButton>
        </SettingButtonBox>
      </SettingScreen>
      <LogoutFrame>
        <LogoutButton
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
        >
          로그아웃
        </LogoutButton>
      </LogoutFrame>
      <TabBar />
    </>
  );
}

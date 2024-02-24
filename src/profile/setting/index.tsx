import { ArrowbackIcon } from "../../components/styles/Icons";
import { TopBar } from "../../components/TopBar";
import { useNavigate } from "react-router-dom";
import {
  SettingButtonBox,
  SettingButton,
  LogoutButton,
  LogoutFrame,
} from "../styles/settingComponents";
import { PaddingScreen } from "../../components/styles/Screen";

export default function Setting() {
  const navigate = useNavigate();
  return (
    <>
      <TopBar
        title="설정"
        leftIcon={<ArrowbackIcon onClick={() => navigate(-1)} />}
      />
      <PaddingScreen>
        <SettingButtonBox>
          <SettingButton to="/setting/edit">기본 프로필 수정</SettingButton>
          <SettingButton to="/notice">공지사항</SettingButton>
          <SettingButton to="/report">신고하기</SettingButton>
          <SettingButton to="/agreement">서비스 이용약관</SettingButton>
          <SettingButton to="/setting/withdrawal">회원 탈퇴하기</SettingButton>
        </SettingButtonBox>
      </PaddingScreen>
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
    </>
  );
}

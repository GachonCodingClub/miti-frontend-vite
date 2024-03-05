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
import { ROUTES } from "../../routes";

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
          <SettingButton to={`${ROUTES.SETTING_EDIT}`}>
            기본 프로필 수정
          </SettingButton>
          <SettingButton to={`${ROUTES.NOTICE}`}>문의하기</SettingButton>
          <SettingButton to={`${ROUTES.REPORT}`}>신고하기</SettingButton>
          <SettingButton to={`${ROUTES.AGREEMENT}`}>
            개인정보처리방침 및 서비스이용약관
          </SettingButton>
          <SettingButton to={`${ROUTES.CHANGE_PASSWORD}`}>
            비밀번호 변경
          </SettingButton>
          <SettingButton to={`${ROUTES.SETTING_WITHDRAWAL}`}>
            회원 탈퇴하기
          </SettingButton>
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

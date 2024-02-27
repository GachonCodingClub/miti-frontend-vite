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
import { PushNotifications } from "@capacitor/push-notifications";

export default function Setting() {
  const navigate = useNavigate();

  // 푸시 알림 등록 함수
  const registerNotifications = async () => {
    let permStatus = await PushNotifications.checkPermissions();
    if (permStatus.receive === "prompt") {
      permStatus = await PushNotifications.requestPermissions();
    }
    if (permStatus.receive === "granted") {
      await PushNotifications.register();
      alert("푸시 알림이 활성화되었습니다.");
    } else {
      alert("푸시 알림 권한이 거부되었습니다.");
    }
  };

  // 푸시 알림 해제 함수
  const unregisterNotifications = async () => {
    await PushNotifications.removeAllListeners();
    alert("푸시 알림이 비활성화되었습니다.");
  };
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

          <button
            onClick={registerNotifications}
            style={{ padding: 10, marginTop: 20, cursor: "pointer" }}
          >
            푸시 알림 활성화
          </button>
          {/* 푸시 알림 해제 버튼 */}
          <button
            onClick={unregisterNotifications}
            style={{ padding: 10, marginTop: 20, cursor: "pointer" }}
          >
            푸시 알림 비활성화
          </button>
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

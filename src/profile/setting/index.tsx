import styled from "styled-components";
import { ArrowbackIcon } from "../../components/Icons";
import { TabBar } from "../../components/TabBar";
import { TopBar } from "../../components/TopBar";
import { Link, useNavigate } from "react-router-dom";

const SettingScreen = styled.div`
  padding: 0 16px;
  padding-top: 56px;
`;

const SettingButtonBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  gap: 7px;
`;

const SettingButton = styled(Link)`
  padding: 16px 24px;
  font-weight: 500;
  color: #000000;
  text-decoration: none;
`;

export default function Setting() {
  const navigate = useNavigate(); // 수정된 부분
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
      <TabBar />
    </>
  );
}

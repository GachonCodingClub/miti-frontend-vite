import { useNavigate } from "react-router-dom";
import { ArrowbackIcon } from "../../components/styles/Icons";
import { TopBar } from "../../components/TopBar";
import styled from "styled-components";
import { Screen } from "../../components/styles/Screen";

export const WithdrawalScreen = styled(Screen)`
  padding: 0;
  padding-top: 56px;
  padding-bottom: 112px;
`;

export default function Withdrawal() {
  const navigate = useNavigate();
  return (
    <>
      <TopBar
        title="회원 탈퇴"
        leftIcon={<ArrowbackIcon onClick={() => navigate(-1)} />}
      />
      <WithdrawalScreen>
        <h1>진짜 탈퇴함?</h1>
      </WithdrawalScreen>
    </>
  );
}

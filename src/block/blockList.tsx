import styled from "styled-components";
import { TopBar } from "../components/TopBar";
import { ArrowbackIcon } from "../components/styles/Icons";
import { useNavigate } from "react-router-dom";
import { Screen } from "../components/styles/Screen";

export const BlockListScreen = styled(Screen)`
  padding-top: 80px;
  padding-bottom: 112px;
`;

export default function BlockList() {
  const navigate = useNavigate();
  return (
    <>
      <TopBar
        leftIcon={<ArrowbackIcon onClick={() => navigate(-1)} />}
        title="차단 유저 목록"
      />
      <BlockListScreen>하잉</BlockListScreen>
    </>
  );
}

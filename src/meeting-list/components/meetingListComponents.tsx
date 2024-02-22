import styled from "styled-components";
import { PaddingScreen } from "../../components/styles/Screen";

export const MeetingListScreen = styled(PaddingScreen)`
  padding-bottom: 92px;
`;

export const MeetingBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 24px;
`;

export const MeetingTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const MeetingInfo = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const PlaceInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

export const PeopleInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const CreateMeetingButton = styled.button`
  background-color: #ff7152;
  width: 48px;
  height: 48px;
  position: fixed;
  bottom: 108px;
  right: 24px;
  border-radius: 50%;
  color: white;
  font-size: 24px;
`;

// 페이징
export const PageFrame = styled.div`
  display: flex;
  justify-content: space-evenly;
  position: fixed;
  max-width: 36rem;
  width: 100%;
  background-color: #fff;
  bottom: 64px;
  padding: 5px 0px;
`;

export const PrevNextButton = styled.button`
  font-size: 14px;
  font-weight: 500;
`;

export const PageNum = styled.button<{ isActive: boolean }>`
  font-size: 14px;
  width: 18px;
  height: 18px;
  background-color: ${({ isActive }) => (isActive ? "#ececec" : "#ffffff")};
  border-radius: 100px;
`;

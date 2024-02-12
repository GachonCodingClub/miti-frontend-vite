import { Link } from "react-router-dom";
import styled from "styled-components";
import { Screen } from "../../components/Screen";

export const MeetingScreen = styled(Screen)`
  padding: 0;
  padding-top: 56px;
  padding-bottom: 64px;
`;

export const MeetingBox = styled(Link)`
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
  bottom: 80px;
  right: 24px;
  border-radius: 50%;
  color: white;
  font-size: 24px;
`;

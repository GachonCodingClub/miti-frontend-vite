import styled from "styled-components";
import { Screen } from "../../components/Screen";

export const ProfileScreen = styled(Screen)`
  padding: 0;
  padding-top: 56px;
  padding-bottom: 64px;
`;

export const ProfileBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 0 24px;
  margin-top: 24px;
`;

export const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ProfileMeetings = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 32px;
`;

export const MeetingTabBar = styled.div`
  display: flex;
  padding: 0 24px;
  font-weight: 500;
  border-bottom: 1px solid #e9e9e9;
`;

export const MeetingList = styled.div``;

import styled from "styled-components";

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

export const HideFrame = styled.div`
  background-color: #eeeeee;
  padding: 8px;
  gap: 16px;
  display: flex;
  justify-content: end;
`;

export const ReqAlertDiv = styled.div`
  position: absolute;
  left: 0px;
  top: 5px;
`;

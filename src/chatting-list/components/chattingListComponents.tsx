import styled from "styled-components";

export interface LastMessages {
  [groupId: string]: {
    content: string;
    createdAt: string;
  };
}

export interface IGroup {
  title: string;
  nowUsers: string;
  id: number;
  unreadMessagesCount?: number;
}

export const ChattingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
`;

export const ChattingFrame = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 16px 24px;
  gap: 16px;
  border-bottom: 1px solid #f2f0ef;
  height: 80px;
`;

export const TitleMemberTimeFrame = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;

export const TitleMemberFrame = styled.div`
  display: flex;
  gap: 8px;
`;

export const TitleText = styled.span`
  font-weight: 600;
  letter-spacing: -0.016em;
`;

export const MemberText = styled.span`
  font-size: 14px;
  letter-spacing: -0.016em;
  color: #a7a7a7;
`;

export const TimeText = styled.span`
  font-size: 12px;
  line-height: 12px;
  letter-spacing: -0.01em;
  color: #a7a7a7;
`;

export const ChatAlertFrame = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

export const ChatText = styled.span`
  font-size: 13px;
  line-height: 14px;
  letter-spacing: -0.01em;
  color: #a7a7a7;

  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-all;
`;

export const AlertCircle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 14px;
  min-width: 14px;
  background: #ff7152;
  border-radius: 100px;
`;

export const AlertCount = styled.span`
  font-size: 10px;
  line-height: 12px;
  letter-spacing: -0.01em;
  color: #ffffff;
`;

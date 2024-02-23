import styled from "styled-components";
import { Screen } from "../../components/styles/Screen";

export interface IChat {
  createdAt: string;
  nickname: string;
  content: string;
}

export const MeetingChatRoomScreen = styled(Screen)`
  padding: 0;
  padding-top: 56px;
  padding-bottom: 24px;
  overflow: hidden;
`;

// 채팅창 전체(채팅내용, 날짜, 입장/퇴장 다 담음)
export const ChatWindowContainer = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin: auto;
  width: 100%;
  overflow-y: auto;
  padding: 10px 10px 20px 10px;
  max-height: 90vh;
  position: relative;
`;

// 날짜랑 누구누구 입장/퇴장 프레임
export const DateAlertFrame = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`;

// 날짜 텍스트
export const DateText = styled.span`
  text-align: center;
  font-size: 10px;
  line-height: 12px;
  letter-spacing: -0.1px;
  padding: 20px 0px;
`;

// 누구 입장/퇴장 텍스트
export const AlertText = styled(DateText)`
  font-size: 12px;
  line-height: 14px;
  letter-spacing: -0.12px;
`;

// 채팅 내용 프레임
export const ChatWindowFrame = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
`;

// 내 채팅 프레임, 여러 개의 채팅이 한 프레임에 담김
export const MyChattingFrame = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  align-self: stretch;
`;

// 내 채팅 하나 하나
export const MyChatting = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  gap: 4px;
  width: 66%;
`;

// 내 채팅 버블
export const MyChattingBubble = styled.div`
  display: flex;
  padding: 8px 12px;
  align-items: flex-start;
  border-radius: 12px 2px 12px 12px;
  background: #ffe8d0;
`;

// 채팅 글자
export const ChattingText = styled.span`
  line-height: 20px;
`;

// 채팅 시간
export const ChattingTime = styled.span`
  font-size: 10px;
  line-height: 12px;
  letter-spacing: -0.1px;
  white-space: nowrap;
`;

// 상대 채팅 프레임, 여러 개의 채팅이 한 프레임에 담김
export const OtherChattingFrame = styled(MyChattingFrame)`
  align-items: flex-start;
`;

// 다른 유저 이름
export const OtherUserName = styled.span`
  font-size: 14px;
  letter-spacing: -0.224px;
  margin-top: 10px;
`;

// 다른 유저 채팅 하나하나
export const OtherChatting = styled(MyChatting)`
  flex-direction: row-reverse;
  // justify-content: flex-start;
`;

// 다른 유저 채팅 버블
export const OtherChattingBubble = styled(MyChattingBubble)`
  border-radius: 2px 12px 12px 12px;
  background: #f6f6f6;
`;

// 채팅 인풋창
export const ChattingInputDiv = styled.div`
  display: flex;
  width: 100%;
  max-width: 36rem;
  padding: 32px 24px;
  align-items: center;
  position: fixed;
  bottom: 0;
  background-color: white;
  box-shadow: 0px -4px 8px 0px rgba(0, 0, 0, 0.04);
`;

// 채팅 인풋
export const ChattingInput = styled.input`
  color: #414141;
  line-height: 20px;

  height: auto;
  white-space: break-spaces;

  width: 100%;
  ::placeholder {
    color: #c0c0c0;
    line-height: 20px;
  }
`;

export const ScrollToBottomButton = styled.button`
  position: fixed;
  right: 20px;
  bottom: 70px;
  padding: 10px 10px;
  background-color: rgba(206, 206, 206, 0.1);

  color: white;
  border: none;
  border-radius: 50%;
  z-index: 30;
`;

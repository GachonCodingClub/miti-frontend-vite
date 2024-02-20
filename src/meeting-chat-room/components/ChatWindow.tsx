import React, { useEffect, useRef } from "react";
import {
  MyChattingFrame,
  ChattingTime,
  MyChattingBubble,
  ChattingText,
  OtherChattingFrame,
  OtherUserName,
  OtherChattingBubble,
  DateAlertFrame,
  DateText,
  MyChatting,
  OtherChatting,
} from "../styles/MeetingChatRoomComponents";
import { getApi } from "../../api/getApi";
import { getDate, getTimeString } from "./getTimeDate";

interface ChatMessage {
  createdAt: string;
  nickname: string;
  content: string;
}

interface ChatWindowProps {
  chatList: ChatMessage[];
  profileNickname: string;
  id: string | undefined;
  setChatList: React.Dispatch<ChatMessage[]>;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  chatList,
  setChatList,
  profileNickname,
  id,
}) => {
  // 기존의 채팅 데이터 가져오기
  const getChatting = async () => {
    try {
      const chatResponse = await getApi({
        link: `/message/${id}/page?page=${0}&&size=${999}`,
      });
      const chatData = await chatResponse.json();
      const formattedChatData = chatData
        .reverse()
        .map(
          (chat: { nickname: string; content: string; createdAt: string }) => ({
            nickname: chat.nickname,
            content: chat.content,
            createdAt: chat.createdAt,
          })
        );
      console.log("채팅 데이터", formattedChatData);

      setChatList(formattedChatData);
      scrollToBottom();
    } catch (error) {
      console.error("채팅 데이터 불러오기 오류", error);
    }
  };

  useEffect(() => {
    getChatting();
  }, [id]);

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  function scrollToBottom() {
    chatEndRef.current?.scrollIntoView();
  }

  return (
    <>
      {chatList.map((chat, index) => {
        let displayTime = true;
        const timeValue = getTimeString(chat.createdAt);
        if (index !== chatList.length - 1) {
          const nextSender = chatList[index + 1].nickname;
          if (nextSender === chat.nickname) {
            const nextTimeValue = getTimeString(chatList[index + 1].createdAt);
            if (nextTimeValue === timeValue) {
              displayTime = false;
            }
          }
        }

        let displayNickname = false;
        let reduceMargin = false;
        if (index !== 0) {
          const prevSender = chatList[index - 1].nickname;
          if (prevSender !== chat.nickname) displayNickname = true;
          reduceMargin = true;
        }

        let displayDate = false;
        if (
          index === 0 ||
          getDate(chatList[index - 1].createdAt) !== getDate(chat.createdAt)
        ) {
          displayDate = true;
        }

        // [MITI] 문자열이 포함되어 있는지 확인
        const isMITIPresent = chat.content.includes("[MITI]");
        // [MITI] 문자열이 포함되어 있다면 해당 부분을 제거한 콘텐츠 생성
        const contentWithoutMITI = chat.content.replace("[MITI]", "");

        return (
          <React.Fragment key={index}>
            {isMITIPresent ? (
              <DateAlertFrame>
                <ChattingText>{contentWithoutMITI}</ChattingText>
              </DateAlertFrame>
            ) : chat.nickname === profileNickname ? (
              <MyChattingFrame>
                <DateAlertFrame>
                  {displayDate && (
                    <DateText>{getDate(chat.createdAt)}</DateText>
                  )}
                </DateAlertFrame>
                <MyChatting>
                  {displayTime && (
                    <ChattingTime>{getTimeString(chat.createdAt)}</ChattingTime>
                  )}
                  <MyChattingBubble
                    style={reduceMargin ? { marginBottom: -10 } : {}}
                  >
                    <ChattingText>{chat.content}</ChattingText>
                  </MyChattingBubble>
                </MyChatting>
              </MyChattingFrame>
            ) : (
              <OtherChattingFrame>
                {displayNickname ? (
                  <OtherUserName>{chat.nickname}</OtherUserName>
                ) : null}
                <OtherChatting>
                  {displayTime ? (
                    <ChattingTime>{getTimeString(chat.createdAt)}</ChattingTime>
                  ) : null}
                  <OtherChattingBubble
                    style={reduceMargin ? { marginBottom: -10 } : {}}
                  >
                    <ChattingText>{chat.content}</ChattingText>
                  </OtherChattingBubble>
                </OtherChatting>
              </OtherChattingFrame>
            )}
          </React.Fragment>
        );
      })}
      <div ref={chatEndRef} />
    </>
  );
};

export default ChatWindow;

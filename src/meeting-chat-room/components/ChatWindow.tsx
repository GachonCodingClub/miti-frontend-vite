import React from "react";
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
} from "./MeetingChatRoomComponents";

interface ChatMessage {
  createdAt: string;
  nickname: string;
  content: string;
}

interface ChatWindowProps {
  chatList: ChatMessage[];
  profileNickname: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  chatList,
  profileNickname,
}) => {
  const getTimeString = (createdAt: string) => {
    const createdTime = new Date(createdAt);
    const hour = createdTime.getHours() + 21;
    const minute = createdTime.getMinutes();
    const hourValue = hour % 12 || 12;
    const minuteValue = minute < 10 ? `0${minute}` : minute;
    const ampm = hourValue >= 12 ? "오전" : "오후";
    const timestamp = `${ampm} ${hourValue} : ${minuteValue}분`;

    return timestamp;
  };

  const getDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
    return `${year}년 ${month}월 ${day}일 ${dayOfWeek}요일`;
  };

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

        return (
          <React.Fragment key={index}>
            {chat.nickname === profileNickname ? (
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
                  </MyChattingBubble>{" "}
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
    </>
  );
};

export default ChatWindow;

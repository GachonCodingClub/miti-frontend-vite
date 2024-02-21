import React, { useEffect, useRef, useState } from "react";
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
  ChatWindowContainer,
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

interface ChatDisplayOptions {
  displayTime: boolean;
  displayNickname: boolean;
  reduceMargin: boolean;
  displayDate: boolean;
  isMITIPresent: boolean;
  contentWithoutMITI: string;
}

function getChatDisplayOptions(
  chatList: ChatMessage[],
  index: number
): ChatDisplayOptions {
  const chat = chatList[index];
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

  const isMITIPresent = chat.content.includes("[MITI]");
  const contentWithoutMITI = chat.content.replace("[MITI]", "");

  return {
    displayTime,
    displayNickname,
    reduceMargin,
    displayDate,
    isMITIPresent,
    contentWithoutMITI,
  };
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  chatList,
  setChatList,
  profileNickname,
  id,
}) => {
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // 새로운 페이지가 더 있는지 여부를 관리
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [page, setPage] = useState(0);

  const getChatting = async (pageNum: number) => {
    if (loading || !id) return;
    setLoading(true);
    const chatResponse = await getApi({
      link: `/message/${id}/page?page=${pageNum}&size=20`,
    });
    const chatData = await chatResponse.json();
    const formattedChatData = chatData.reverse().map((chat: ChatMessage) => ({
      nickname: chat.nickname,
      content: chat.content,
      createdAt: chat.createdAt,
    }));

    // 새로운 데이터가 없을 경우 더 이상 스크롤 이벤트를 발생시키지 않음
    if (formattedChatData.length < 20) {
      setHasMore(false);
    }

    if (pageNum === 0) {
      setChatList(formattedChatData);
      // 페이지 초기 로딩 시 최하단으로 스크롤
      setTimeout(
        () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }),
        100
      );
    } else {
      const previousScrollHeight = chatContainerRef.current?.scrollHeight ?? 0;
      setChatList((prevChats) => [...formattedChatData, ...prevChats]);
      requestAnimationFrame(() => {
        const currentScrollHeight = chatContainerRef.current?.scrollHeight ?? 0;
        chatContainerRef.current?.scrollTo(
          0,
          currentScrollHeight - previousScrollHeight
        );
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (hasMore) getChatting(page);
  }, [page, id]);

  useEffect(() => {
    const handleScroll = () => {
      if (!chatContainerRef.current) return;
      const isAtTop = chatContainerRef.current.scrollTop === 0;
      if (isAtTop && !loading && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    const chatContainer = chatContainerRef.current;
    chatContainer?.addEventListener("scroll", handleScroll);
    return () => chatContainer?.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  // 채팅 목록이 업데이트되어도 페이지 처음 로드 시에만 최하단으로 스크롤되도록 조정
  // useEffect(() => {
  //   if (chatContainer && chatList.length > 0 && page === 0) {
  //     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  //   }
  // }, [chatList, page]);

  return (
    <ChatWindowContainer ref={chatContainerRef}>
      {chatList.map((chat, index) => {
        const {
          displayTime,
          displayNickname,
          reduceMargin,
          displayDate,
          isMITIPresent,
          contentWithoutMITI,
        } = getChatDisplayOptions(chatList, index);
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
    </ChatWindowContainer>
  );
};

export default ChatWindow;

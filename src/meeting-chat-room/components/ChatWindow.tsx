import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  MyChattingFrame,
  ChattingTime,
  MyChattingBubble,
  ChattingText,
  OtherChattingFrame,
  OtherUserName,
  OtherChattingBubble,
  DateText,
  MyChatting,
  OtherChatting,
  ChatWindowContainer,
  ScrollToBottomButton,
} from "../styles/MeetingChatRoomComponents";
import { getApi } from "../../api/getApi";
import { getDate, getTimeString } from "./getTimeDate";

interface ChatMessage {
  createdAt: string;
  nickname: string;
  content: string;
}

interface BlockedUser {
  nickname: string;
  userId: string;
  contents: string;
}

interface BlockedUserData {
  blockedUserOutputs: BlockedUser[];
}

interface ChatWindowProps {
  chatList: ChatMessage[];
  profileNickname: string | undefined;
  id: string | undefined;
  setChatList: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  keyboardHeight: number;
  blockData: BlockedUserData;
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
  keyboardHeight,
  blockData,
}) => {
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
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
      setTimeout(() => chatEndRef.current?.scrollIntoView(), 100);
    } else {
      const previousScrollHeight = chatContainerRef.current?.scrollHeight ?? 0;
      setChatList((prevChats: ChatMessage[]) => {
        return [...formattedChatData, ...prevChats];
      });
      requestAnimationFrame(() => {
        setTimeout(() => {
          const currentScrollHeight =
            chatContainerRef.current?.scrollHeight ?? 0;
          chatContainerRef.current?.scrollTo(
            0,
            currentScrollHeight - previousScrollHeight
          );
        }, 1); // 1ms
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

  // 하단 스크롤 버튼
  const [showScrollButton, setShowScrollButton] = useState(false);

  const handleScroll = useCallback(() => {
    if (!chatContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    // 스크롤이 일정 거리 이상 올라갔는지 확인
    if (scrollHeight - scrollTop > clientHeight * 1.5) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  }, []);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView();
  };

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    chatContainer?.addEventListener("scroll", handleScroll);
    return () => chatContainer?.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const isScrollAtBottom = () => {
      if (!chatContainerRef.current) return false;

      const { scrollTop, scrollHeight, clientHeight } =
        chatContainerRef.current;
      // 스크롤 위치가 최하단에 있는지 확인 (300px 여유)
      return scrollHeight - scrollTop <= clientHeight + 300;
    };

    if (isScrollAtBottom()) {
      // 스크롤이 최하단에 위치해 있다면, chatList 업데이트 후에도 최하단으로 유지
      scrollToBottom();
    }
    // chatList가 변경될 때마다 이 useEffect가 실행됨
  }, [chatList]); // chatList가 변경될 때마다 이 효과를 재실행

  const containerStyle = {
    paddingBottom: keyboardHeight + "px",
  };

  useEffect(() => {
    if (keyboardHeight > 0) {
      // 키보드 높이가 0보다 크다면, 즉 키보드가 활성화되었다면
      chatEndRef.current?.scrollIntoView();
    }
  }, [keyboardHeight]);

  const blockedUserNicknames = useMemo(() => {
    return new Set(blockData?.blockedUserOutputs.map((user) => user?.nickname));
  }, [blockData]);

  return (
    <ChatWindowContainer style={containerStyle} ref={chatContainerRef}>
      {chatList.map((chat, index) => {
        const isUserBlocked = blockedUserNicknames.has(chat.nickname);

        const chatContent = isUserBlocked
          ? "차단된 메시지입니다."
          : chat.content;

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
              <div className="flex w-full justify-center">
                <span className="text-sm whitespace-pre-wrap break-words break-all">
                  {contentWithoutMITI}
                </span>
              </div>
            ) : chat.nickname === profileNickname ? (
              <MyChattingFrame>
                <div className="flex w-full justify-center">
                  {displayDate && (
                    <DateText>{getDate(chat.createdAt)}</DateText>
                  )}
                </div>
                <MyChatting>
                  {displayTime && (
                    <ChattingTime>{getTimeString(chat.createdAt)}</ChattingTime>
                  )}
                  <MyChattingBubble
                    style={reduceMargin ? { marginBottom: -10 } : {}}
                  >
                    <ChattingText>{chatContent}</ChattingText>
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
                    <ChattingText>{chatContent}</ChattingText>
                  </OtherChattingBubble>
                </OtherChatting>
              </OtherChattingFrame>
            )}
            {showScrollButton && (
              <ScrollToBottomButton onClick={scrollToBottom}>
                ↓
              </ScrollToBottomButton>
            )}
          </React.Fragment>
        );
      })}
      <div className="pt-12" id="chatEnd" ref={chatEndRef}></div>
    </ChatWindowContainer>
  );
};

export default ChatWindow;

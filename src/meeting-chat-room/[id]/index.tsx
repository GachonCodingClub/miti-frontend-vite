import {
  MeetingChatRoomScreen,
  ChatWindowContainer,
  ChattingInputDiv,
  ChattingInput,
  RightMenuFrame,
  MenuAnimation,
  IChat,
  ChattingText,
  ChattingTime,
  DateAlertFrame,
  DateText,
  MyChatting,
  MyChattingBubble,
  MyChattingFrame,
  OtherChatting,
  OtherChattingBubble,
  OtherChattingFrame,
  OtherUserName,
} from "../styles/MeetingChatRoomComponents";
import { useEffect, useRef, useState } from "react";
import * as StompJs from "@stomp/stompjs";
import { useQuery } from "react-query";
import { getApi } from "../../api/getApi";
import { TopBar } from "../../components/TopBar";
import {
  ArrowbackIcon,
  HamburgerIcon,
  SendIcon,
} from "../../components/styles/Icons";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import SideMenu from "../components/sideMenu";
import { Dialog } from "../../components/styles/Button";
import { ROUTES } from "../../routes";
import { useSetRecoilState } from "recoil";
import { SnackBarAtom } from "../../atoms";
import { getDate, getTimeString } from "../components/getTimeDate";
import React from "react";
import { getHeaders } from "../../components/getHeaders";
import { Overlay } from "../../sign-up/styles/detailComponents";

export default function MeetingChatRoom() {
  const navigate = useNavigate();
  const { id } = useParams();

  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token + "");
  const headers = getHeaders(token);

  // 유저 프로필 가져오기
  const getUserProfile = async () => {
    const response = await getApi({ link: `/users/profile/my` });
    const data = await response.json();
    return data;
  };
  const { data: profile, isLoading: profileLoading } = useQuery(
    ["profile"],
    getUserProfile
  );

  const getGroup = async () => {
    try {
      const response = await getApi({ link: `/groups/${id}` });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("채팅 데이터 불러오기 오류", error);
      throw error;
    }
  };
  const { data: group, isLoading: groupLoading } = useQuery(
    ["group", id],
    getGroup,
    {
      enabled: !!id,
    }
  );
  // 로딩 상태
  const loading = profileLoading || groupLoading;

  const [chatList, setChatList] = useState<IChat[]>([]); // 채팅 메시지 리스트
  const [message, setMessage] = useState(""); // 사용자가 보낼 메시지

  // 미티 웹소켓 주소
  const brokerUrl =
    "ws://mitiappserver-env.eba-r2uts3k4.ap-northeast-2.elasticbeanstalk.com/ws/chat/websocket";
  // client 객체가 StompJs.Client 타입을 따르도록
  const client = useRef<StompJs.Client>(null!); // WebSocket 클라이언트 객체
  // useRef 초기값을 null이 아님으로 설정

  // Connect
  // WebSocket 연결 함수
  const connect = () => {
    // StompJs 라이브러리의 Client 객체를 생성, .current프로퍼티에 값 저장
    client.current = new StompJs.Client({
      brokerURL: brokerUrl, // WebSocket 연결 주소
      onConnect: () => {
        subscribe(); // 연결 성공 시 구독
      },
    });
    // 생성한 StompJs 클라이언트를 활성화
    client.current.activate();
  };

  // Publish
  // 채팅 메시지 발행 함수
  const publish = (chat: string) => {
    // 웹소켓 연결이 없으면 함수를 종료 (보호 조건)
    if (!client.current.connected) return;
    // StompJs의 publish 메서드를 사용하여 채팅 메시지를 발행
    client.current.publish({
      destination: "/pub/send", // 메시지를 보낼 때에는 여기로
      body: chat, // 메시지 내용
    });
  };

  // Subscribe
  // 특정 토픽 구독 함수
  const subscribe = () => {
    // 토픽 URL이 없으면 함수 종료. 토픽 없으면 구독 안함
    if (!id) {
      return;
    }
    // StompJs의 subscribe 메서드를 사용하여 특정 토픽을 구독
    // subscribe는 서버에서 해당 토픽으로 메시지가 전달될 때마다 콜백 함수가 실행
    client.current.subscribe(`/sub/${id}`, (body: { body: string }) => {
      /* 서버에서 받은 body 객체에서 body 속성을 추출하고 
        이를 JSON 형태로 파싱하여 채팅 메시지로 사용 */
      const json_body = JSON.parse(body.body);
      // 채팅 메시지 리스트 업데이트
      setChatList((_chat_list) => [{ ...json_body }, ..._chat_list]);
    });
  };

  // Disconnect
  // WebSocket 연결 해제 함수
  const disconnect = () => {
    // StompJs 라이브러리의 deactivate 메서드를 사용하여 WebSocket 클라이언트를 비활성화
    client.current.deactivate();
  };

  // 채팅 메시지
  const handleChangeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  // 폼 제출 이벤트 핸들러 함수
  const handleSubmit = (
    event: { preventDefault: () => void }, // 제출 이벤트
    message: string,
    id: number | string | unknown
  ) => {
    event.preventDefault();
    // 메시지가 공백인 경우 전송하지 않음
    if (message.trim() === "") {
      return;
    }
    // 발행 함수 호출을 통해 메시지 전송, stomp 프로토콜로 websocket을 통해 메시지 발송
    publish(
      JSON.stringify({
        // 정보를 JSON 문자열로 변환
        message: message,
        sender: decoded.sub,
        groupId: id,
      })
    );
    setMessage("");
    scrollToBottom();
  }; // 제출된 JSON문자열은 서버로 전송됨

  useEffect(() => {
    connect(); // // 컴포넌트가 마운트될 때 WebSocket 연결
    return () => disconnect(); // 컴포넌트가 언마운트될 때 WebSocket 연결 해제
  }, []);

  // 메뉴 표시
  const [showRightMenu, setShowRightMenu] = useState(false);

  // (방장) 방 폭파
  const DeleteUrl = `${import.meta.env.VITE_BASE_URL}/groups/${id}`;

  const setRoomDelted = useSetRecoilState(SnackBarAtom);
  const handleDeleteRoom = () => {
    fetch(DeleteUrl, {
      method: "DELETE",
      mode: "cors",
      headers: headers,
    });

    setRoomDelted(true);
    navigate(`${ROUTES.MEETING_LIST}`);
    setTimeout(() => {
      setRoomDelted(false);
    }, 3000);
  };

  const ExitUrl = `${import.meta.env.VITE_BASE_URL}/groups/${id}/leave`;

  const setRoomExited = useSetRecoilState(SnackBarAtom);
  const handleExitRoom = () => {
    fetch(ExitUrl, {
      method: "GET",
      mode: "cors",
      headers: headers,
    });

    setRoomExited(true);
    navigate(`${ROUTES.MEETING_LIST}`);
    setTimeout(() => {
      setRoomExited(false);
    }, 3000);
  };

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  function scrollToBottom() {
    chatEndRef.current?.scrollIntoView();
  }

  // 무한스크롤
  const [page, setPage] = useState(0);

  // 기존의 채팅 데이터 가져오기
  const getChatting = async (page: number) => {
    try {
      const chatResponse = await getApi({
        link: `/message/${id}/page?page=${page}`,
      });
      const chatData = await chatResponse.json();
      console.log("불러온 채팅 :", chatData);
      // const formattedChatData = chatData.reverse();
      // console.log("채팅 데이터", formattedChatData);

      setChatList((prev) => [...prev, ...chatData]);
    } catch (error) {
      console.error("채팅 데이터 불러오기 오류", error);
    }
  };

  useEffect(() => {
    getChatting(page);
  }, [page]);

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };
  // 페이지 엔드 리퍼런스를 useRef(null)로 초기화
  const pageStart = useRef(null);

  useEffect(() => {
    if (pageStart.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            console.log("로드 몰", page);
            loadMore();
          }
        },
        { threshold: 1 }
      );
      observer.observe(pageStart.current);
    }
  }, []);

  return (
    <>
      <TopBar
        title={loading ? `로딩중...` : `${group?.title}`}
        leftIcon={<ArrowbackIcon onClick={() => navigate(`/chat-list`)} />}
        rightIcon={
          <HamburgerIcon
            onClick={() => {
              setShowRightMenu(true);
            }}
          />
        }
      />
      {loading ? (
        <MeetingChatRoomScreen>
          <div>로딩중이에요</div>
        </MeetingChatRoomScreen>
      ) : (
        <MeetingChatRoomScreen>
          <ChatWindowContainer>
            {chatList.map((chat, index) => {
              let displayTime = true;
              const timeValue = getTimeString(chat.createdAt);
              // 현재 채팅이 리스트의 첫번째 채팅이 아닌 경우
              if (index !== 0) {
                const prevSender = chatList[index - 1].nickname; // 이전 채팅의 보낸 사람을 가져옴
                // 이전 채팅의 보낸 사람이 현재 채팅의 보낸 사람과 동일한 경우
                if (prevSender === chat.nickname) {
                  const nextTimeValue = getTimeString(
                    chatList[index - 1].createdAt
                  ); // 이전 채팅의 생성 시간을 가져옴
                  // 이전 채팅의 생성 시간이 현재 채팅의 생성 시간과 동일한 경우
                  if (nextTimeValue === timeValue) {
                    displayTime = false;
                  }
                }
              }

              let displayNickname = true;
              let reduceMargin = false;
              // 현재 채팅이 마지막이 아닌 경우
              if (index !== chatList.length - 1) {
                const nextSender = chatList[index + 1].nickname; // 다음 채팅의 보낸 사람을 가져옴
                // 다음 채팅의 보낸 사람이 현재 채팅의 보낸 사람과 다른 경우
                if (nextSender === chat.nickname) {
                  displayNickname = false;
                }
                reduceMargin = true;
              }

              // 날짜를 표시할지 여부를 결정하는 변수 초기화
              let displayDate = true;
              // 현재 채팅이 첫 번째인 경우 또는 다음 채팅의 날짜가 현재 채팅의 날짜와 다른 경우
              if (
                index === 0 ||
                getDate(chatList[index + 1]?.createdAt) ===
                  getDate(chat?.createdAt)
              ) {
                displayDate = false; // 날짜를 표시함
              }

              // [MITI] 문자열이 포함되어 있는지 확인
              const isMITIPresent = chat.content?.includes("[MITI]");
              // [MITI] 문자열이 포함되어 있다면 해당 부분을 제거한 콘텐츠 생성
              const contentWithoutMITI = chat.content?.replace("[MITI]", "");

              return (
                <React.Fragment key={index}>
                  {isMITIPresent ? (
                    <DateAlertFrame>
                      <ChattingText>{contentWithoutMITI}</ChattingText>
                    </DateAlertFrame>
                  ) : chat.nickname === profile?.nickname ? (
                    <MyChattingFrame>
                      <DateAlertFrame>
                        {displayDate && (
                          <DateText>{getDate(chat.createdAt)}</DateText>
                        )}
                      </DateAlertFrame>
                      <MyChatting>
                        {displayTime && (
                          <ChattingTime>
                            {getTimeString(chat.createdAt)}
                          </ChattingTime>
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
                          <ChattingTime>
                            {getTimeString(chat.createdAt)}
                          </ChattingTime>
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

            <div ref={pageStart}>마지막</div>
          </ChatWindowContainer>
          <div>
            <label htmlFor="topic-url" hidden />
            <input type="number" id="topic-url" value={id} hidden />
            <button hidden onClick={() => subscribe()} />
          </div>
          <form onSubmit={(event) => handleSubmit(event, message, id)}>
            <input placeholder="groupId" type="number" value={id} hidden />
            <ChattingInputDiv>
              <ChattingInput
                placeholder="메시지 입력"
                type="text"
                value={message}
                onChange={handleChangeMessage}
              />
              <button type="submit">
                <SendIcon />
              </button>
            </ChattingInputDiv>
          </form>
          {/* 사이드 메뉴 */}
          {showRightMenu && (
            <>
              <Overlay
                onClick={() => {
                  setShowRightMenu(false);
                }}
              />
              <RightMenuFrame
                initial="hidden"
                animate={showRightMenu ? "visible" : "hidden"}
                variants={MenuAnimation}
              >
                <SideMenu
                  dialogProps={setShowDeleteDialog}
                  exitProps={setShowExitDialog}
                />
              </RightMenuFrame>
            </>
          )}
          {showDeleteDialog && (
            <Overlay style={{ zIndex: "31", whiteSpace: "pre-line" }}>
              <Dialog
                title="미팅 삭제하고 나가기"
                contents={`그동안 나눈 대화 내용이 삭제돼요. 
                    삭제한 미팅은 복구할 수 없어요.`}
                left="취소"
                right="미팅 삭제"
                onLeftClick={() => {
                  setShowDeleteDialog(false);
                }}
                onRightClick={handleDeleteRoom}
              />
            </Overlay>
          )}
          {showExitDialog && (
            <Overlay style={{ zIndex: "31", whiteSpace: "pre-line" }}>
              <Dialog
                title="미팅 나가기"
                contents={`퇴장한 미팅은 다시 참여할 수 없어요.`}
                left="취소"
                right="미팅 나가기"
                onLeftClick={() => {
                  setShowExitDialog(false);
                }}
                onRightClick={handleExitRoom}
              />
            </Overlay>
          )}
        </MeetingChatRoomScreen>
      )}
    </>
  );
}

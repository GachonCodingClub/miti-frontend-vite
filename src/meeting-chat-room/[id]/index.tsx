import {
  ChattingInputDiv,
  ChattingInput,
  IChat,
  MeetingChatRoomScreen,
} from "../styles/MeetingChatRoomComponents";
import { useEffect, useRef, useState } from "react";
import * as StompJs from "@stomp/stompjs";
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
import React from "react";
import { getHeaders } from "../../components/getHeaders";
import { CharCount, Overlay } from "../../sign-up/styles/detailComponents";
import ChatWindow from "../components/ChatWindow";
import { RightMenuFrame, MenuAnimation } from "../styles/SideMenuComponents";
import useGetGroups from "../../api/useGetGroups";
import useGetMyProfile from "../../api/useGetMyProfile";

export default function MeetingChatRoom() {
  const navigate = useNavigate();
  const { id } = useParams();

  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token + "");
  const headers = getHeaders(token);

  const [charCount, setCharCount] = useState(0);
  const MAX_INTRODUCE_LENGTH = 255;

  // 유저 프로필 가져오기
  const { data: profile, isLoading: profileLoading } = useGetMyProfile();
  const {
    data: group,
    isLoading: isGroupLoading,
    error: groupError,
  } = useGetGroups(id);

  // 로딩 상태
  const loading = profileLoading || isGroupLoading;

  const [chatList, setChatList] = useState<IChat[]>([]); // 채팅 메시지 리스트
  const [message, setMessage] = useState(""); // 사용자가 보낼 메시지

  // 채팅방 들어왔을때 API호출
  const getAlert = async () => {
    try {
      const res = await getApi({ link: `/message/${id}/refresh/last-read` });
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("알림 오류", error);

      throw error;
    }
  };
  useEffect(() => {
    getAlert();
  }, [chatList]);

  // 미티 웹소켓 주소
  const brokerUrl = `${import.meta.env.VITE_WEBSOCKET_URL}`;

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

    scrollToBottom();
  };
  const scrollToBottom = () => {
    // ChatWindow 컴포넌트에 ref를 추가하고, 해당 ref를 사용하여 스크롤 이동
    document.getElementById("chatEnd")?.scrollIntoView();
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
      setChatList((_chat_list) => [..._chat_list, { ...json_body }]);
    });
  };

  // Disconnect
  // WebSocket 연결 해제 함수
  const disconnect = () => {
    // StompJs 라이브러리의 deactivate 메서드를 사용하여 WebSocket 클라이언트를 비활성화
    client.current.deactivate();
  };

  // 채팅 메시지
  const handleChangeMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    setCharCount(e.target.value.length);
  };

  const inputRef = useRef<HTMLTextAreaElement>(null);

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
    setCharCount(0);

    // 메시지 전송 후 입력 필드에 포커스를 다시 맞춥니다.
    // ref 객체의 current 속성이 실제 DOM 요소를 가리키는지 확인
    if (inputRef.current) {
      inputRef.current.focus();
    }
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

  if (groupError) return <div>데이터 로딩 중 오류 발생</div>;
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
          <>
            <ChatWindow
              chatList={chatList}
              setChatList={setChatList}
              profileNickname={profile?.nickname}
              id={id}
            />
          </>
          <div>
            <label htmlFor="topic-url" hidden />
            <input type="number" id="topic-url" value={id} hidden />
            <button hidden onClick={() => subscribe()} />
          </div>
          <form onSubmit={(event) => handleSubmit(event, message, id)}>
            <input placeholder="groupId" type="number" value={id} hidden />
            <ChattingInputDiv>
              <ChattingInput
                ref={inputRef}
                placeholder="메시지 입력"
                value={message}
                onChange={handleChangeMessage}
              />
              <button type="submit">
                {message.trim() === "" ? (
                  <SendIcon active={false} />
                ) : (
                  <SendIcon active={true} />
                )}
              </button>
              {charCount >= 0 && (
                <div className="absolute bottom-1 right-2">
                  <CharCount>
                    {charCount} / {MAX_INTRODUCE_LENGTH}
                  </CharCount>
                </div>
              )}
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

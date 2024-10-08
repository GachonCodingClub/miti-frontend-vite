import {
  ChattingInputDiv,
  IChat,
  MeetingChatRoomScreen,
  ChattingTextarea,
  ChatCount,
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
import { ROUTES } from "../../routes";
import { useSetRecoilState } from "recoil";
import { SnackBarAtom } from "../../atoms";
import React from "react";
import { getHeaders } from "../../components/getHeaders";
import { Overlay } from "../../sign-up/styles/detailComponents";
import ChatWindow from "../components/ChatWindow";
import { RightMenuFrame, MenuAnimation } from "../styles/SideMenuComponents";
import { useGetMyProfile } from "../../api/profile";
import { Keyboard } from "@capacitor/keyboard";
import { Capacitor, PluginListenerHandle } from "@capacitor/core";
import { InLoading } from "../../components/InLoading";
import { useGetBlockList } from "../../api/blockList";
import { App } from "@capacitor/app";
import { useGetGroups } from "../../api/useGetGroups";
import { useQueryClient } from "react-query";
import { Dialog } from "../../components/Dialog";
import { useOneBtnDialog } from "../../hooks/useOntBtnDialog";

export default function MeetingChatRoom() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();

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
  const { oneBtnDialog, showOneBtnDialog, hideOneBtnDialog } =
    useOneBtnDialog();
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

  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  // 채팅 메시지
  const handleChangeMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    setCharCount(e.target.value.length);
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

    // 임시로 Input을 만들고 다시 없앰
    // 사용자는 채팅을 누르면 이 Input으로 임시로 focus를 옮김
    const tempInput = document.createElement("input");
    tempInput.setAttribute("type", "text");
    tempInput.style.position = "absolute";
    tempInput.style.opacity = "0";
    document.body.appendChild(tempInput);
    tempInput.focus();
    document.body.removeChild(tempInput);

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

    if (messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }; // 제출된 JSON문자열은 서버로 전송됨

  useEffect(() => {
    connect(); // // 컴포넌트가 마운트될 때 WebSocket 연결
    return () => disconnect(); // 컴포넌트가 언마운트될 때 WebSocket 연결 해제
  }, []);

  let limitedTitle = "";

  if (group && typeof group.title === "string") {
    limitedTitle =
      group.title.length > 15
        ? `${group.title.substring(0, 15)}...`
        : group.title;
  }

  const { data: blockData } = useGetBlockList();

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
    queryClient.invalidateQueries(["group"]);

    showOneBtnDialog("미팅을 삭제했어요");
  };

  const ExitUrl = `${import.meta.env.VITE_BASE_URL}/groups/${id}/leave`;

  // (비방장) 방 나가기
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

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    let showListener: PluginListenerHandle | null = null;
    let hideListener: PluginListenerHandle | null = null;

    if (Capacitor.getPlatform() === "ios") {
      // iOS에서만 키보드 높이를 감지하고 상태를 업데이트
      showListener = Keyboard.addListener("keyboardWillShow", (info) => {
        setKeyboardHeight(info.keyboardHeight);
      });

      hideListener = Keyboard.addListener("keyboardWillHide", () => {
        setKeyboardHeight(0);
      });
    }

    const handleAppResume = () => {
      getAlert();
    };

    // 리스너 등록
    const resumeListener = App.addListener("appStateChange", (state) => {
      // 앱이 resume 상태로 변경될 때만 handleAppResume 함수 호출
      if (state.isActive) {
        handleAppResume();
        navigate(`/meeting-chat-room/${id}`);
      }
    });

    return () => {
      // 리스너 제거
      showListener?.remove();
      hideListener?.remove();
      resumeListener?.remove();
    };
  }, []);

  // ChattingInputDiv 컴포넌트의 스타일을 조정
  // 예: 키보드 높이만큼 padding-bottom을 추가하여 textarea를 위로 올림
  const chattingInputDivStyle = {
    paddingBottom: keyboardHeight + "px",
  };

  if (groupError) return <InLoading />;
  return (
    <>
      <TopBar
        title={loading ? `로딩중...` : limitedTitle}
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
          <InLoading />
        </MeetingChatRoomScreen>
      ) : (
        <MeetingChatRoomScreen>
          <>
            <ChatWindow
              chatList={chatList}
              setChatList={setChatList}
              profileNickname={profile?.nickname}
              id={id}
              keyboardHeight={keyboardHeight}
              blockData={blockData}
            />
          </>
          <div>
            <label htmlFor="topic-url" hidden />
            <input type="number" id="topic-url" value={id} hidden />
            <button hidden onClick={() => subscribe()} />
          </div>
          <form onSubmit={(event) => handleSubmit(event, message, id)}>
            <input placeholder="groupId" type="number" value={id} hidden />
            <ChattingInputDiv style={chattingInputDivStyle}>
              <ChattingTextarea
                placeholder="메시지 입력"
                value={message}
                onChange={handleChangeMessage}
                ref={messageInputRef}
              />
              <div>
                <button className="pr-1 z-10">
                  {message.trim() === "" ? (
                    <SendIcon active={false} />
                  ) : (
                    <SendIcon active={true} />
                  )}
                </button>
                {charCount >= 0 && (
                  <div className="fixed">
                    <ChatCount>
                      {charCount} / {MAX_INTRODUCE_LENGTH}
                    </ChatCount>
                  </div>
                )}
              </div>
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
            <Overlay
              onClick={() => {
                setShowDeleteDialog(false);
              }}
              style={{ zIndex: "31", whiteSpace: "pre-line" }}
            >
              <Dialog
                title="미팅 삭제하고 나가기"
                contents={`그동안 나눈 대화 내용이 삭제돼요. 
                    삭제한 미팅은 복구할 수 없어요`}
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
            <Overlay
              onClick={() => {
                setShowExitDialog(false);
              }}
              style={{ zIndex: "31", whiteSpace: "pre-line" }}
            >
              <Dialog
                title="미팅 나가기"
                contents={`퇴장한 미팅은 다시 참여할 수 없어요`}
                left="취소"
                right="미팅 나가기"
                onLeftClick={() => {
                  setShowExitDialog(false);
                }}
                onRightClick={handleExitRoom}
              />
            </Overlay>
          )}

          {oneBtnDialog.open && (
            <Overlay style={{ zIndex: "31", whiteSpace: "pre-line" }}>
              <Dialog
                title={oneBtnDialog.title}
                right="확인"
                isOneBtn
                onRightClick={() => {
                  hideOneBtnDialog;
                  navigate(`${ROUTES.MEETING_LIST}`);
                  setTimeout(() => {
                    setRoomDelted(false);
                  }, 3000);
                }}
              />
            </Overlay>
          )}
        </MeetingChatRoomScreen>
      )}
    </>
  );
}

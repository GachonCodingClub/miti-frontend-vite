import {
  MeetingChatRoomScreen,
  ChatWindowContainer,
  DateAlertFrame,
  DateText,
  AlertText,
  ChatWindowFrame,
  MyChattingFrame,
  MyChatting,
  MyChattingBubble,
  ChattingText,
  ChattingTime,
  OtherChattingFrame,
  OtherUserName,
  OtherChatting,
  OtherChattingBubble,
  ChattingInputDiv,
  ChattingInput,
  RightMenuFrame,
  MenuAnimation,
} from "../components/MeetingChatRoomComponents";
import { useEffect, useRef, useState } from "react";
import * as StompJs from "@stomp/stompjs";
import { useQuery } from "react-query";
import { getApi } from "../../api/getApi";
import { TopBar } from "../../components/TopBar";
import { Overlay } from "../../sign-up/components/detailComponents";
import { ArrowbackIcon, HamburgerIcon, SendIcon } from "../../components/Icons";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import SideMenu from "../components/sideMenu";
import { Dialog } from "../../components/Button";
import { ROUTES } from "../../routes";
import { useSetRecoilState } from "recoil";
import { SnackBarAtom } from "../../atoms";

/* Topic URL, GroupID, sender가 모두 작성된 상태에서만 메시지가 보내짐
      Connect -> Subscribe -> Publish -> Disconnect 순으로 작동
      Connect는 brokerUrl이 제대로 설정되어 있으면 알아서 작동함
      Connect가 제대로 작동하면 connect()함수 안에서 subscribe() 실행
      Subscribe에 topicURL을 줌. 이거는 아마 방 id로 주면 될 듯 함 
      topicURL이 유효하면 그 채팅 메시지 리스트를 가져옴 
      그리고 Publish는 그냥 메시지를 서버(/pub/send)로 보내는 함수 
      Disconnect는 제곧내 */

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

// MeetingChatRoom 함수
export default function MeetingChatRoom() {
  const navigate = useNavigate();
  const { id } = useParams();

  const userToken = localStorage.getItem("token");
  const decoded = jwtDecode(userToken + "");

  // 유저 프로필 가져오기
  const getUserProfile = async () => {
    const response = await getApi({ link: `/users/profile/my` });
    const data = await response.json();
    return data;
  };

  const { data: profile } = useQuery(["profile"], getUserProfile);

  // 기존의 채팅 데이터 가져오기
  useEffect(() => {
    const getChatting = async () => {
      try {
        const chatResponse = await getApi({ link: `/message/${id}` });
        const chatData = await chatResponse.json();
        console.log("기존 채팅 데이터", chatData);

        // 채팅 데이터를 chatList 상태에 설정하여 화면에 표시
        setChatList(
          chatData.map(
            (chat: {
              nickname: string;
              content: string;
              createdAt: string;
            }) => ({
              nickname: chat.nickname,
              content: chat.content,
              createdAt: chat.createdAt,
            })
          )
        );
      } catch (error) {
        console.error("채팅 데이터 불러오기 오류", error);
      }
    };
    getChatting();
  }, [id]); // 'id'를 의존성으로 포함하여 'id' 매개변수가 변경될 때마다 채팅 가져옴.

  const getGroup = async () => {
    try {
      // getApi 함수를 사용하여 외부 API에서 데이터를 가져옴
      // API 엔드포인트 경로는 `/groups/${id}`로 지정되며, id는 외부에서 전달되는 매개변수
      const response = await getApi({ link: `/groups/${id}` });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching group data:", error);
      throw error; // 에러를 상위로 전파
    }
  };

  // useQuery 훅을 사용하여 데이터를 가져오는 부분
  const { data: group } = useQuery(["group", id], getGroup, {
    enabled: !!id, // enabled 옵션을 사용하여 id가 존재할 때에만 데이터를 가져오도록 설정
  });

  // 제네릭으로 타입 명시
  const [chatList, setChatList] = useState<
    {
      createdAt: string;
      nickname: string;
      content: string;
    }[]
  >([]); // 채팅 메시지 리스트
  const [message, setMessage] = useState(""); // 사용자가 보낼 메시지
  const [sender, setSender] = useState(decoded.sub); // 발신자
  const [groupId, setGroupId] = useState(id); // 그룹 ID
  const [topicUrl, setTopicUrl] = useState(id); // 토픽 URL
  // 미티 웹소켓 주소
  const brokerUrl =
    "ws://mitiappserver-env.eba-r2uts3k4.ap-northeast-2.elasticbeanstalk.com/ws/chat/websocket";
  // client 객체가 StompJs.Client 타입을 따르도록
  const client = useRef<StompJs.Client>(null!); // WebSocket 클라이언트 객체
  // useRef 초기값을 null이 아님으로 설정

  //

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
    if (!topicUrl) {
      console.log("끊김");
      return;
    }

    // StompJs의 subscribe 메서드를 사용하여 특정 토픽을 구독
    // subscribe는 서버에서 해당 토픽으로 메시지가 전달될 때마다 콜백 함수가 실행
    client.current.subscribe(`/sub/${topicUrl}`, (body: { body: string }) => {
      /* 서버에서 받은 body 객체에서 body 속성을 추출하고 
        이를 JSON 형태로 파싱하여 채팅 메시지로 사용 */
      const json_body = JSON.parse(body.body);
      console.log("바디", body.body);
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

  //

  // 입력값이 변경될 때마다 상태를 업데이트 하는 이벤트 핸들러 함수들
  // 채팅 메시지
  const handleChangeMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };
  // 그룹 ID
  const handleChangeGroupId = (event: React.ChangeEvent<HTMLInputElement>) => {
    // parseInt 또는 Number 함수를 사용하여 문자열을 숫자로 변환
    setGroupId(event.target.value);
  };
  // 발신자
  const handleChangeSender = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSender(event.target.value);
  };
  // 토픽
  const handleTopicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTopicUrl(event.target.value);
  };

  //

  // 폼 제출 이벤트 핸들러 함수
  const handleSubmit = (
    event: { preventDefault: () => void }, // 제출 이벤트
    message: string,
    sender: string | undefined,
    groupId: number | string | unknown
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
        sender: sender,
        groupId: groupId,
      })
    );

    setMessage("");
  }; // 제출된 JSON문자열은 서버로 전송됨

  //

  // 컴포넌트가 마운트될 때 한 번만 호출되는 효과 훅
  useEffect(() => {
    connect(); // // 컴포넌트가 마운트될 때 WebSocket 연결

    // 컴포넌트가 언마운트될 때 WebSocket 연결 해제
    return () => disconnect();
  }, []);

  // 메뉴 표시
  const [showRightMenu, setShowRightMenu] = useState(false);

  const onClickMenu = () => {
    setShowRightMenu(true);
  };

  const setRoomDelted = useSetRecoilState(SnackBarAtom);
  const handleDeleteRoom = () => {
    // 방 나가기 버튼 클릭 시 실행되는 함수
    setRoomDelted(true);
    navigate(`${ROUTES.MEETING_LIST}`);
    // 3초 후에 setRoomDelted를 false로 변경
    setTimeout(() => {
      setRoomDelted(false);
    }, 3000);
  };

  const [showMeetingDeleteAndRunDialog, setShowMeetingDeleteAndRunDialog] =
    useState(false);

  return (
    <>
      <TopBar
        title={`${group?.title}`}
        leftIcon={<ArrowbackIcon onClick={() => navigate(-1)} />}
        rightIcon={<HamburgerIcon onClick={onClickMenu} />}
      />
      <MeetingChatRoomScreen>
        <ChatWindowContainer>
          <DateAlertFrame>
            <DateText>2023년 12월 2일 토요일</DateText>
            <AlertText>김현중 님이 입장했습니다.</AlertText>
          </DateAlertFrame>
          {chatList.map((chat, index) => {
            let displayTime = true;
            const timeValue = getTimeString(chat.createdAt);
            if (index !== chatList.length - 1) {
              const nextSender = chatList[index + 1].nickname;
              if (nextSender === chat.nickname) {
                const nextTimeValue = getTimeString(
                  chatList[index + 1].createdAt
                );
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
            return (
              <ChatWindowFrame key={index}>
                {chat.nickname === profile.nickname ? (
                  <MyChattingFrame>
                    <MyChatting>
                      {displayTime ? (
                        <ChattingTime>
                          {getTimeString(chat.createdAt)}
                        </ChattingTime>
                      ) : null}
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
              </ChatWindowFrame>
            );
          })}
        </ChatWindowContainer>
        <div>
          <label htmlFor="topic-url" hidden>
            Topic URL:
          </label>
          <input
            type="number"
            id="topic-url"
            value={topicUrl}
            onChange={handleTopicChange}
            hidden
          />
          <button hidden onClick={() => subscribe()}>
            Subscribe
          </button>
        </div>
        <form
          onSubmit={(event) => handleSubmit(event, message, sender, groupId)}
        >
          <input
            placeholder="sender"
            type="text"
            value={sender}
            onChange={handleChangeSender}
            hidden
          />
          <input
            placeholder="groupId"
            type="number"
            value={id}
            onChange={handleChangeGroupId}
            hidden
          />
          <ChattingInputDiv>
            <ChattingInput
              placeholder="메시지 입력"
              type="text"
              value={message}
              onChange={handleChangeMessage}
            ></ChattingInput>

            <button type="submit">
              <SendIcon />
            </button>
          </ChattingInputDiv>
        </form>
        {/* 사이드 메뉴 */}
        {showRightMenu && (
          <>
            <Overlay
              style={{ zIndex: "30" }}
              onClick={() => {
                setShowRightMenu(false);
              }}
            />
            <RightMenuFrame
              initial="hidden"
              animate={showRightMenu ? "visible" : "hidden"}
              variants={MenuAnimation}
            >
              <SideMenu dialogProps={setShowMeetingDeleteAndRunDialog} />
            </RightMenuFrame>
          </>
        )}
        {showMeetingDeleteAndRunDialog && (
          <Overlay style={{ zIndex: "31", whiteSpace: "pre-line" }}>
            <Dialog
              title="미팅 삭제하고 나가기"
              contents={`그동안 나눈 대화 내용이 삭제돼요. 
                    삭제한 미팅은 복구할 수 없어요.`}
              left="취소"
              right="미팅 삭제"
              onLeftClick={() => {
                setShowMeetingDeleteAndRunDialog(false);
              }}
              onRightClick={handleDeleteRoom}
            />
          </Overlay>
        )}
      </MeetingChatRoomScreen>
    </>
  );
}

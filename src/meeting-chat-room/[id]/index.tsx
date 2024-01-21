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
  GrayLine,
  MenuDateLocationFrame,
  MenuDateLocationMemberContainer,
  MenuDateLocationText,
  MenuDetailAndButtonContainer,
  MenuDetailAndMemberWrapper,
  MenuDetailFrame,
  MenuDetailText,
  MenuMeetingDesc,
  MenuMeetingTitle,
  MenuMeetingTitleAndDescFrame,
  MenuMemberAndReqButtonWrapper,
  MenuMemberContainer,
  MenuMemberFrame,
  MenuModifyMeetingButton,
  MenuSmallGrayLine,
  MenuUserDetailFrame,
  MenuUserDetailText,
  MenuUserNickname,
  MenuUserProfileFrame,
  ParticipationReqButton,
  RightMenuFrame,
  MenuAnimation,
  MenuDeleteMeetingAndRunButton,
  MenuMasterFrame,
} from "../components/MeetingChatRoomComponents";
import { useEffect, useRef, useState } from "react";
import * as StompJs from "@stomp/stompjs";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useQuery } from "react-query";
import { getApi } from "../../api/getApi";
import { userEmailAtom, SnackBarAtom } from "../../atoms";
import { Dialog } from "../../components/Button";
import { TopBar } from "../../components/TopBar";
import { ROUTES } from "../../routes";
import { Overlay } from "../../sign-up/components/detailComponents";
import { getDate } from "../../utils";
import {
  ArrowbackIcon,
  HamburgerIcon,
  SendIcon,
  DateIcon,
  LocationIcon,
  PersonIcon,
  OrangeCrownIcon,
} from "../../components/Icons";
import { useNavigate, useParams } from "react-router-dom";

/* Topic URL, GroupID, sender가 모두 작성된 상태에서만 메시지가 보내짐
      Connect -> Subscribe -> Publish -> Disconnect 순으로 작동
      Connect는 brokerUrl이 제대로 설정되어 있으면 알아서 작동함
      Connect가 제대로 작동하면 connect()함수 안에서 subscribe() 실행
      Subscribe에 topicURL을 줌. 이거는 아마 방 id로 주면 될 듯 함 
      topicURL이 유효하면 그 채팅 메시지 리스트를 가져옴 
      그리고 Publish는 그냥 메시지를 서버(/pub/send)로 보내는 함수 
      Disconnect는 제곧내 */

// MeetingChatRoom 함수
export default function MeetingChatRoom() {
  // url에서 채팅방 id 가져오기
  const navigate = useNavigate();
  const { id } = useParams();

  // 유저 정보
  const userEmailState = useRecoilState(userEmailAtom);
  const userEmail = userEmailState[0];

  const getUserProfile = async () => {
    const response = await getApi({ link: `/users/profile/my` });
    const data = await response.json();
    console.log("데이타", data);
    return data;
  };

  const { data: profile } = useQuery(["profile"], getUserProfile);

  // 제네릭으로 타입 명시
  const [chatList, setChatList] = useState<
    { nickname: string; content: string; timestamp: string }[]
  >([]); // 채팅 메시지 리스트
  const [message, setMessage] = useState(""); // 사용자가 보낼 메시지
  const [sender, setSender] = useState(userEmail); // 발신자
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
    // 이 topicUrl이 방 번호가 되려나?
    // subscribe는 서버에서 해당 토픽으로 메시지가 전달될 때마다 콜백 함수가 실행
    client.current.subscribe(`/sub/${topicUrl}`, (body: { body: string }) => {
      console.log("여기에 구독했어요 : /sub/" + topicUrl);

      /* 서버에서 받은 body 객체에서 body 속성을 추출하고 
        이를 JSON 형태로 파싱하여 채팅 메시지로 사용 */
      const json_body = JSON.parse(body.body);

      // 현재 시간을 가져오기
      const currentTime = new Date();

      // 시간을 '오후 00시 00분' 형식으로 변환
      const hours = currentTime.getHours();
      const minutes = currentTime.getMinutes();
      const ampm = hours >= 12 ? "오후" : "오전";
      const formattedHours = (hours % 12).toString().padStart(2, "0");
      const formattedMinutes = minutes.toString().padStart(2, "0");
      const timestamp = `${ampm} ${formattedHours} : ${formattedMinutes}`;

      // 채팅 메시지 리스트 업데이트
      setChatList((_chat_list) => [
        ..._chat_list,
        { ...json_body, timestamp: timestamp },
      ]);
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
    console.log("현재 토픽 url은? :", event.target.value);
  };

  //

  // 폼 제출 이벤트 핸들러 함수
  const handleSubmit = (
    event: { preventDefault: () => void }, // 제출 이벤트
    message: string,
    sender: string,
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

  // 원래 채팅 불러오기
  useEffect(() => {
    const getChatting = async () => {
      try {
        const chatResponse = await getApi({ link: `/message/${id}` });
        const chatData = await chatResponse.json();
        console.log("기존 채팅 데이터", chatData);
        // 채팅 데이터를 상태에 저장하는 로직이 필요하다면 여기에 추가
      } catch (error) {
        console.error("Error load chatting data", error);
      }
    };

    // 컴포넌트가 마운트될 때 한 번 호출
    getChatting();
  }, []);

  // 메뉴 세부정보 가져오기
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
  const [date, setDate] = useState("");
  useEffect(() => {
    if (group) {
      setDate(getDate(group.meetDate));
    }
  }, [group]);

  // #방장, 미팅 삭제하고 나가기
  // 다이얼로그
  const [showMeetingDeleteAndRunDialog, setShowMeetingDeleteAndRunDialog] =
    useState(false);
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

  return (
    <>
      <TopBar
        title="임시 제목"
        leftIcon={<ArrowbackIcon onClick={() => navigate(-1)} />}
        rightIcon={<HamburgerIcon onClick={onClickMenu} />}
      />
      <MeetingChatRoomScreen>
        <ChatWindowContainer>
          <DateAlertFrame>
            <DateText>2023년 12월 2일 토요일</DateText>
            <AlertText>김현중 님이 입장했습니다.</AlertText>
          </DateAlertFrame>
          {chatList.map((chat, index) => (
            <ChatWindowFrame key={index}>
              {chat.nickname === profile.nickname ? (
                <MyChattingFrame>
                  <MyChatting>
                    <ChattingTime>{chat.timestamp}</ChattingTime>
                    <MyChattingBubble>
                      <ChattingText>{chat.content}</ChattingText>
                    </MyChattingBubble>
                  </MyChatting>
                </MyChattingFrame>
              ) : (
                <OtherChattingFrame>
                  <OtherUserName>{chat.nickname}</OtherUserName>
                  <OtherChatting>
                    <ChattingTime>{chat.timestamp}</ChattingTime>
                    <OtherChattingBubble>
                      <ChattingText>{chat.content}</ChattingText>
                    </OtherChattingBubble>
                  </OtherChatting>
                </OtherChattingFrame>
              )}
            </ChatWindowFrame>
          ))}
        </ChatWindowContainer>
        <div>
          <label htmlFor="topic-url">Topic URL:</label>
          <input
            type="number"
            id="topic-url"
            value={topicUrl}
            onChange={handleTopicChange}
          />
          <button onClick={() => subscribe()}>Subscribe</button>
        </div>
        <form
          onSubmit={(event) => handleSubmit(event, message, sender, groupId)}
        >
          <input
            placeholder="sender"
            type="text"
            value={sender}
            onChange={handleChangeSender}
          />
          <input
            placeholder="groupId"
            type="number"
            value={id}
            onChange={handleChangeGroupId}
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

        {/* 메뉴 눌렀을 때, 나중에 분리 */}
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
              {/* 제목과 설명 */}
              <MenuMeetingTitleAndDescFrame>
                <MenuMeetingTitle>{group.title}</MenuMeetingTitle>
                <MenuMeetingDesc>{group.description}</MenuMeetingDesc>
              </MenuMeetingTitleAndDescFrame>
              <GrayLine />
              <MenuDetailAndMemberWrapper>
                {/* 미팅 디테일 */}
                <MenuDetailAndButtonContainer>
                  <MenuDetailFrame>
                    <MenuDetailText>세부 정보</MenuDetailText>
                    <MenuDateLocationMemberContainer>
                      <MenuDateLocationFrame>
                        <DateIcon />
                        <MenuDateLocationText>{date}</MenuDateLocationText>
                      </MenuDateLocationFrame>
                      <MenuDateLocationFrame>
                        <LocationIcon />
                        <MenuDateLocationText>
                          {group.meetPlace}
                        </MenuDateLocationText>
                      </MenuDateLocationFrame>
                      <MenuDateLocationFrame>
                        <PersonIcon />
                        <MenuDateLocationText>
                          ?명 / {group.maxUsers}명
                        </MenuDateLocationText>
                      </MenuDateLocationFrame>
                    </MenuDateLocationMemberContainer>
                  </MenuDetailFrame>
                  <MenuModifyMeetingButton
                    onClick={() => {
                      navigate(`/edit-meeting/${id}`);
                    }}
                  >
                    미팅 수정
                  </MenuModifyMeetingButton>
                </MenuDetailAndButtonContainer>
              </MenuDetailAndMemberWrapper>
              <MenuSmallGrayLine />
              {/* 참여자 */}
              <MenuMemberAndReqButtonWrapper>
                <MenuMemberContainer>
                  <MenuDetailText>참여자</MenuDetailText>
                  <MenuMemberFrame>
                    {/* 홍당무 */}
                    <MenuUserProfileFrame>
                      <MenuMasterFrame>
                        <MenuUserNickname>홍당무</MenuUserNickname>
                        <OrangeCrownIcon />
                      </MenuMasterFrame>
                      <MenuUserDetailFrame>
                        <MenuUserDetailText>24살</MenuUserDetailText>
                        <MenuUserDetailText>남자</MenuUserDetailText>
                        <MenuUserDetailText>170cm</MenuUserDetailText>
                        <MenuUserDetailText>80kg</MenuUserDetailText>
                      </MenuUserDetailFrame>
                    </MenuUserProfileFrame>
                    {/* 김쿵야 */}
                    <MenuUserProfileFrame>
                      <MenuUserNickname>김쿵야</MenuUserNickname>
                      <MenuUserDetailFrame>
                        <MenuUserDetailText>24살</MenuUserDetailText>
                        <MenuUserDetailText>남자</MenuUserDetailText>
                        <MenuUserDetailText>170cm</MenuUserDetailText>
                        <MenuUserDetailText>80kg</MenuUserDetailText>
                      </MenuUserDetailFrame>
                    </MenuUserProfileFrame>
                    {/* 차은우 */}
                    <MenuUserProfileFrame>
                      <MenuUserNickname>차은우</MenuUserNickname>
                      <MenuUserDetailFrame>
                        <MenuUserDetailText>24살</MenuUserDetailText>
                        <MenuUserDetailText>남자</MenuUserDetailText>
                        <MenuUserDetailText>170cm</MenuUserDetailText>
                        <MenuUserDetailText>80kg</MenuUserDetailText>
                      </MenuUserDetailFrame>
                    </MenuUserProfileFrame>
                  </MenuMemberFrame>
                </MenuMemberContainer>
                <ParticipationReqButton
                  onClick={() => {
                    console.log("참여 요청");
                  }}
                >
                  참여 요청 목록
                </ParticipationReqButton>
              </MenuMemberAndReqButtonWrapper>
              {/* 삭제하고 나가기 */}
              <MenuDeleteMeetingAndRunButton
                onClick={() => {
                  setShowMeetingDeleteAndRunDialog(true);
                }}
              >
                미팅 삭제하고 나가기
              </MenuDeleteMeetingAndRunButton>
            </RightMenuFrame>
            {showMeetingDeleteAndRunDialog && (
              <Overlay style={{ zIndex: "40", whiteSpace: "pre-line" }}>
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
          </>
        )}
      </MeetingChatRoomScreen>
    </>
  );
}

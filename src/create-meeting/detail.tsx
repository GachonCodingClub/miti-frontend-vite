import { useEffect, useState } from "react";
import {
  Dialog,
  DialogOneBtn,
  LongOrangeBtn,
} from "../components/styles/Button";
import { Overlay } from "../sign-up/components/detailComponents";
import { MyInputBoxSVG } from "../components/MyInputBox";
import { TopBar } from "../components/TopBar";
import { getApi } from "../api/getApi";
import { ArrowbackIcon } from "../components/styles/Icons";
import { useQuery } from "react-query";
import { ROUTES } from "../routes";
import { fetchMeeting } from "./components/fetchMeeting";
import { IValidationProps, validateForm } from "./components/validateInfo";
import MeetingDetailsInputs from "./components/meetingDetailInput";
import AdditionalParticipantsList from "./components/additionalParticipantsList";
import { useRecoilStates } from "./components/useRecoilState";
import {
  CreateMeetingDetailScreen,
  DatePlaceMemberFrame,
  AddMemberFrame,
  AddMemberText,
  AddMemberButton,
  SubmitButtonFrame,
} from "./styles/createMeetingDetailComponents";
import { GrayLine } from "../meeting-chat-room/styles/MeetingChatRoomComponents";
import { useNavigate, useParams } from "react-router-dom";
import { useLocalStorageToken } from "../hooks/useLocalStorageToken";
import { getHeaders } from "../components/getHeaders";

export default function CreateMeetingDetail() {
  // 리코일에서 가져온 정보
  const { meetingTitle, meetingDesc, myNickname } = useRecoilStates();
  const token = useLocalStorageToken();
  const { id } = useParams();

  // id가 있으면 isUpdate가 true
  const isUpdate = !!id;

  // 업데이트인 경우 기존 룸 데이터를 가져옴
  const getGroup = async () => {
    try {
      const response = await getApi({ link: `/groups/${id}` });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("그룹 데이터를 불러오는 중 오류 발생:", error);
      throw error; // 에러를 상위로 전파
    }
  };

  // useQuery 훅을 사용하여 데이터를 가져오는 부분
  const { data: group } = useQuery(
    ["group", id],
    () => {
      if (id) {
        return getGroup();
      }
    },
    {
      enabled: !!id, // enabled 옵션을 사용하여 id가 존재할 때에만 데이터를 가져오도록 설정
    }
  );

  // 날짜
  const [selecteDate, setSelecteDate] = useState("");
  const formattedDate = selecteDate && new Date(selecteDate).toISOString();

  // 날짜 변화 handleDateChange함수
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelecteDate(e.target.value);
  };
  const [dateError, setDateError] = useState(""); // 날짜 오류 메시지

  // 장소
  const [inputPlace, setInputPlace] = useState(""); // 사용자가 입력하는 장소
  const onPlaceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPlace = event.target.value;
    setInputPlace(newPlace);
  };
  const [placeError, setPlaceError] = useState(""); // 장소 오류 메시지

  // isUpdate가 존재할 경우 기본 value를 설정
  useEffect(() => {
    if (isUpdate) {
      setInputPlace(group?.meetPlace);
    }
  }, [group?.meetPlace, isUpdate]);

  // 인원
  const [inputMember, setInputMember] = useState("2"); // 사용자 입력 input 기본은 2
  const onMemberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMember = event.target.value;
    // 미팅 인원이 2보다 작으면 에러 설정
    if (parseInt(newMember, 10) < 2) {
      setMemberError("인원은 2 이상이어야 합니다.");
    } else {
      setMemberError(""); // 그렇지 않으면 에러 해제
    }
    setInputMember(newMember);
  };
  const [memberError, setMemberError] = useState(""); // 인원 오류 메시지
  // 인원 텍스트를 숫자로 변환
  const numericInputMember = parseInt(inputMember, 10); // 문자열을 10진수 숫자로
  // 인원 확정되면 Input비활성화 시키기
  const [inputMemberDisabled, setInputMemberDisabled] = useState(false);
  // 인원 수정 버튼(SVG)
  const [memberCountModi, setMemberCountModi] = useState(false);

  // =============================================== GrayLine

  // 닉네임으로 참여자 추가(선택 입력)
  const [additionalParticipants, setAdditionalParticipants] = useState<
    string[]
  >([]);

  // Dialog 띄우는 부분
  // 존재하지 않는 닉네임일때 Dialog
  const [nonExistentDialog, setNonExistentDialog] = useState(false);
  // 본인을 추가했을때 Dialog
  const [addMyNicknameDialog, setAddMyNicknameDialog] = useState(false);
  // 최대 인원보다 더 추가하려 할 때 뜨는 오류 Dialog
  const [cannotAddDialog, setCannotAddDialog] = useState(false);
  // 사용자가 인원 먼저 확정 안지었을때 뜨는 Dialog
  const [confirmErrorDialog, setConfirmErrorDialog] = useState(false);
  // 닉네임 중복, 혹은 빈칸일 때 뜨는 Dialog
  const [duplicateOrBlankErrorDialog, setDuplicateOrBlankErrorDialog] =
    useState(false);
  // 미팅 정원이랑 추가한 유저수가 같으면 뜨는 Dialog
  const [sameNumberUsersErrorDialog, setSameNumberUsersErrorDialog] =
    useState(false);

  // 현재 추가한 유저 수 몇명인지
  const currentParticipantsCount = additionalParticipants.length; // 배열 길이 이용
  // 사용자에게 입력 받은 추가 참여자 닉네임
  const [inputAdditionalNickname, setInputAdditionalNickname] = useState("");

  // 닉네임 추가+ 버튼 클릭 이벤트
  const onAddNicknameClick = async () => {
    try {
      const response = await getApi({
        link: `/auth/check/nickname?nickname=${inputAdditionalNickname}`,
      }); // 존재하는 닉네임인지 체크, 결과를 response에 저장

      if (!inputMemberDisabled) {
        // inputMemberDisabled가 false인 경우, 추가할 수 없으므로 confirm 에러를 설정
        setConfirmErrorDialog(true);
        return; // 닉네임 추가를 중단
      }

      // trim()으로 문자열 뒤 공백 제거
      const trimmedNickname = inputAdditionalNickname.trim();

      // 추가된 닉네임 배열에 빈 문자열이 있는지 확인
      if (trimmedNickname === "") {
        return;
      }

      // response의 상태 코드가 409(중복)라면
      if (response.status !== 409) {
        setNonExistentDialog(true); // 존재하지 않는 닉네임 추가하려 하면 오류 띄우기
      } else {
        // 이미 추가한 닉네임 중 중복된 닉네임이 없으면 추가
        if (additionalParticipants.includes(trimmedNickname)) {
          setDuplicateOrBlankErrorDialog(true); // 이미 추가한 닉네임 추가하려 하면 오류 띄우기
          return;
        }

        // 미팅 정원 -1 이랑, 사용자가 추가하려는 인원 수 비교, 사 추 인이 적어야 추가 가능
        if (additionalParticipants.length >= numericInputMember - 1) {
          setCannotAddDialog(true); // 미팅 정원보다 많이 추가하려 하면 오류 띄우기
          return;
        }

        // 닉네임이 myNickname과 같은지 확인
        if (trimmedNickname === myNickname) {
          setAddMyNicknameDialog(true); // 본인 닉네임 추가 못하게 막기
          return;
        }

        // 그렇지 않다면 추가된 닉네임 배열 끝에 inputAdditionalNickname 추가
        setAdditionalParticipants([...additionalParticipants, trimmedNickname]);
        setInputAdditionalNickname(""); // 추가 후 입력 필드를 지움
      }
    } catch (error) {
      console.error("비동기 작업 중 오류 발생!!!!", error);
    }
  };

  // 추가된 닉네임 삭제 함수
  // 함수는 index를 매개변수로 받아 특정 index에 해당하는 닉네임을 삭제
  const onRemoveNicknameClick = (index: number) => {
    // additionalParticipants배열을 복사하여 updatedParticipants에 저장
    // 직접 상태 수정하지 않고, 새 배열을 생성해 불변성을 유지하기 위해
    const updatedParticipants = [...additionalParticipants];
    /* splice method를 사용하여 updatedParticipants 배열에서 index에 해당하는 
    위치의 닉네임을 1개 제거 */
    updatedParticipants.splice(index, 1);
    setAdditionalParticipants(updatedParticipants);
  };
  // 닉네임 입력 전체 삭제
  const onDeleteAllMembersClick = () => {
    setAdditionalParticipants([]);
  };

  // 등록 완료 스낵바
  const navigate = useNavigate();
  const [showEnrollBar, setShowEnrollBar] = useState(false);
  const onEnrollClick = () => {
    {
      !isUpdate ? navigate(ROUTES.MEETING_LIST) : navigate(ROUTES.CHAT_LIST);
    }
  };

  // 등록 완료 스낵바 표시
  const displayEnrollBar = () => {
    setSameNumberUsersErrorDialog(false);
    setShowEnrollBar(true);
  };

  // 등록 완료 스낵바 닫기
  const closeEnrollBar = () => {
    setShowEnrollBar(false);
  };

  // 헤더에 Authorization을 추가하여 토큰을 전송
  const headers = getHeaders(token);

  // 미팅 등록 또는 수정
  const submitMeeting = async () => {
    try {
      const bodyData = {
        description: meetingDesc,
        title: meetingTitle,
        meetDate: formattedDate,
        meetPlace: inputPlace,
        ...(isUpdate
          ? {}
          : {
              maxUsers: numericInputMember,
              nicknames: additionalParticipants,
            }),
      };
      // post/patch 함수
      await fetchMeeting({
        isUpdate,
        id,
        headers,
        meetingData: bodyData,
      });

      displayEnrollBar();
    } catch (error) {
      console.error("비동기 작업 중 오류 발생:", error);
      closeEnrollBar();
    }
  };

  const validationParameter: IValidationProps = {
    selecteDate,
    inputPlace,
    numericInputMember,
    additionalParticipants,
    setDateError,
    setPlaceError,
    setMemberError,
    setDuplicateOrBlankErrorDialog,
  };

  // 조건을 검사하고 미팅 등록 또는 수정 실행
  const onSubmitButtonClick = () => {
    if (validateForm(validationParameter)) {
      // currentParticipantsCount가 additionalParticipants의 길이와 같은지 확인
      if (currentParticipantsCount + 1 !== numericInputMember) {
        submitMeeting();
      } else {
        // currentParticipantsCount가 additionalParticipants의 길이와 같은 경우
        setSameNumberUsersErrorDialog(true);
      }
    }
  };
  return (
    <>
      <TopBar
        title={isUpdate ? "미팅 수정하기" : "미팅 만들기"}
        leftIcon={<ArrowbackIcon onClick={() => navigate(-1)} />}
      />
      <CreateMeetingDetailScreen>
        <DatePlaceMemberFrame>
          {!isUpdate ? (
            <MeetingDetailsInputs
              selecteDate={selecteDate}
              handleDateChange={handleDateChange}
              dateError={dateError}
              inputPlace={inputPlace}
              onPlaceChange={onPlaceChange}
              placeError={placeError}
              inputMember={inputMember}
              onMemberChange={onMemberChange}
              memberError={memberError}
              inputMemberDisabled={inputMemberDisabled}
              setInputMemberDisabled={setInputMemberDisabled}
              setMemberCountModi={setMemberCountModi}
            />
          ) : (
            <MeetingDetailsInputs
              selecteDate={selecteDate}
              handleDateChange={handleDateChange}
              dateError={dateError}
              inputPlace={inputPlace}
              onPlaceChange={onPlaceChange}
              placeError={placeError}
              inputMember={inputMember}
              onMemberChange={() => {}}
              memberError={"미팅 인원은 수정할 수 없어요"}
              inputMemberDisabled={true}
              setInputMemberDisabled={setInputMemberDisabled}
              setMemberCountModi={() => {
                setMemberCountModi(false);
              }}
            />
          )}

          {memberCountModi && (
            <Overlay className="z-30">
              <Dialog
                title="미팅 인원을 수정하시겠습니까?"
                contents="추가 인원 목록이 삭제됩니다."
                left="아니요"
                onLeftClick={() => {
                  setInputMemberDisabled(true);
                  setMemberCountModi(false);
                }}
                right="예"
                onRightClick={() => {
                  setMemberCountModi(false);
                  onDeleteAllMembersClick();
                }}
              />
            </Overlay>
          )}
          {confirmErrorDialog && (
            <Overlay className="z-30">
              <DialogOneBtn
                title="먼저 인원을 확정 지어주세요."
                contents=""
                onRightClick={() => {
                  setConfirmErrorDialog(false);
                }}
                right="닫기"
              />
            </Overlay>
          )}
        </DatePlaceMemberFrame>

        <GrayLine />

        {!isUpdate && (
          <AddMemberFrame>
            <AddMemberText>닉네임으로 참여자 추가(선택 입력)</AddMemberText>
            <div style={{ display: "flex", alignItems: "center" }}>
              <MyInputBoxSVG
                onClick={() => {}}
                label=""
                value={inputAdditionalNickname}
                onChange={(e) => setInputAdditionalNickname(e.target.value)}
                placeholder="추가 참여자 닉네임(선택 입력)"
                type="text"
              />
              <AddMemberButton onClick={onAddNicknameClick}>+</AddMemberButton>
            </div>
          </AddMemberFrame>
        )}

        {/* 추가된 닉네임들을 표시 */}
        {additionalParticipants.length > 0 && (
          <AdditionalParticipantsList
            participants={additionalParticipants}
            onRemoveNicknameClick={onRemoveNicknameClick}
          />
        )}

        {addMyNicknameDialog && (
          <Overlay className="z-30">
            <DialogOneBtn
              title="본인은 추가할 수 없어요."
              contents=""
              onRightClick={() => {
                setAddMyNicknameDialog(false);
              }}
              right="닫기"
            />
          </Overlay>
        )}

        {nonExistentDialog && (
          <Overlay className="z-30">
            <DialogOneBtn
              title="존재하지 않는 닉네임이에요."
              contents=""
              onRightClick={() => {
                setNonExistentDialog(false);
              }}
              right="닫기"
            />
          </Overlay>
        )}

        {cannotAddDialog && (
          <Overlay className="z-30">
            <DialogOneBtn
              title="미팅 인원보다 많이 추가할 수 없어요."
              contents=""
              onRightClick={() => {
                setCannotAddDialog(false);
              }}
              right="닫기"
            />
          </Overlay>
        )}

        {duplicateOrBlankErrorDialog && (
          <Overlay className="z-30">
            <DialogOneBtn
              title="닉네임을 확인해 주세요."
              contents="중복된 닉네임이나 빈칸이 있어요."
              onRightClick={() => {
                setDuplicateOrBlankErrorDialog(false);
              }}
              right="닫기"
            />
          </Overlay>
        )}

        {sameNumberUsersErrorDialog && (
          <Overlay className="z-30">
            <DialogOneBtn
              title="미팅 정원과 참여자의 수가 같아요."
              contents=""
              onRightClick={() => {
                setSameNumberUsersErrorDialog(false);
              }}
              right="닫기"
            />
          </Overlay>
        )}

        {showEnrollBar && (
          <Overlay className="z-30">
            <DialogOneBtn
              title="등록 완료"
              contents=""
              onRightClick={onEnrollClick}
              right="돌아가기"
            />
          </Overlay>
        )}
      </CreateMeetingDetailScreen>
      <SubmitButtonFrame>
        <LongOrangeBtn
          onClick={onSubmitButtonClick}
          text={isUpdate ? "미팅 수정" : "미팅 등록"}
        ></LongOrangeBtn>
      </SubmitButtonFrame>
    </>
  );
}

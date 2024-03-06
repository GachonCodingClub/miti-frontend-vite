import { useEffect, useState } from "react";
import {
  Dialog,
  DialogOneBtn,
  LongOrangeBtn,
} from "../components/styles/Button";
import { Overlay } from "../sign-up/styles/detailComponents";
import { MyInputBoxSVG } from "../components/MyInputBox";
import { TopBar } from "../components/TopBar";
import { getApi } from "../api/getApi";
import { ArrowbackIcon } from "../components/styles/Icons";
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
import { useNavigate, useParams } from "react-router-dom";
import { useLocalStorageToken } from "../hooks/useLocalStorageToken";
import { getHeaders } from "../components/getHeaders";
import { GrayLine } from "../meeting-chat-room/styles/SideMenuComponents";
import useGetGroups from "../api/useGetGroups";
import { useGetMyProfile } from "../api/profile";
import { Keyboard } from "@capacitor/keyboard";

export default function CreateMeetingDetail() {
  const { meetingTitle, meetingDesc } = useRecoilStates();
  const token = useLocalStorageToken();
  const { id } = useParams();

  // id가 있으면 isUpdate가 true
  const isUpdate = !!id;

  const { data: group } = useGetGroups(id);

  const { data: profile } = useGetMyProfile();

  // 날짜
  const [selecteDate, setSelecteDate] = useState("");
  const formattedDate = selecteDate && new Date(selecteDate).toISOString();

  // 날짜 변화 handleDateChange함수
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    setSelecteDate(selectedDate);
  };
  const [dateError, setDateError] = useState("");

  // 장소
  const [inputPlace, setInputPlace] = useState(""); // 사용자가 입력하는 장소
  const onPlaceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPlace = event.target.value;
    setInputPlace(newPlace);
  };
  const [placeError, setPlaceError] = useState("");

  // isUpdate가 존재할 경우 기본 value를 설정
  useEffect(() => {
    if (isUpdate && group?.meetDate) {
      setInputPlace(group?.meetPlace);
      const meetDate = new Date(group.meetDate);
      meetDate.setTime(meetDate.getTime() + 9 * 60 * 60 * 1000);

      const year = meetDate.getFullYear();
      const month = (meetDate.getMonth() + 1).toString().padStart(2, "0"); // 월은 0부터 시작하므로 1을 더해줍니다.
      const day = meetDate.getDate().toString().padStart(2, "0");
      const hours = meetDate.getHours().toString().padStart(2, "0");
      const minutes = meetDate.getMinutes().toString().padStart(2, "0");

      const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

      setSelecteDate(formattedDateTime);
    }
  }, [group?.meetDate, group?.meetPlace, isUpdate]);

  // 인원
  const [inputMember, setInputMember] = useState("2"); // 사용자 입력 input 기본은 2
  const onMemberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMember = event.target.value;
    // 미팅 인원이 2보다 작으면 에러 설정
    if (parseInt(newMember, 10) < 2) {
      setMemberError("인원은 2 이상이어야 합니다.");
    } else {
      setMemberError("");
    }
    setInputMember(newMember);
  };
  const [memberError, setMemberError] = useState("");
  // 인원 텍스트를 숫자로 변환
  const numericInputMember = parseInt(inputMember, 10); // 문자열을 10진수 숫자로
  const [inputMemberDisabled, setInputDisabled] = useState(false);
  const [modiSVG, setModiSVG] = useState(false);

  // =============================================== GrayLine

  // 닉네임으로 참여자 추가(선택 입력)
  const [additionalParticipants, setAdditionalParticipants] = useState<
    string[]
  >([]);

  // 존재하지 않는 닉네임일때 Dialog
  const [nonExistDialog, setNonExistDialog] = useState(false);
  // 본인을 추가했을때 Dialog
  const [addMyNicknameDialog, setAddMyNicknameDialog] = useState(false);
  // 최대 인원보다 더 추가하려 할 때 뜨는 오류 Dialog
  const [cannotAddDialog, setCannotAddDialog] = useState(false);
  // 사용자가 인원 먼저 확정 안지었을때 뜨는 Dialog
  const [confirmErrorDialog, setConfirmErrorDialog] = useState(false);
  // 닉네임 중복, 혹은 빈칸일 때 뜨는 Dialog
  const [duplicateBlankErrorDialog, setDuplicateBlankErrorDialog] =
    useState(false);
  // 미팅 정원이랑 추가한 유저수가 같으면 뜨는 Dialog
  const [overlapDialog, setOverlapDialog] = useState(false);

  // 현재 추가한 유저 수 몇명인지
  const currentParticipantsCount = additionalParticipants.length;
  // 사용자에게 입력 받은 추가 참여자 닉네임
  const [inputAddNickname, setInputAddNickname] = useState("");

  // 닉네임 추가+ 버튼 클릭 이벤트
  const onAddNicknameClick = async () => {
    try {
      const response = await getApi({
        link: `/auth/check/nickname?nickname=${inputAddNickname}`,
      }); // 존재하는 닉네임인지 체크, 결과를 response에 저장

      if (!inputMemberDisabled) {
        // inputMemberDisabled가 false인 경우, 추가할 수 없으므로 confirm 에러를 설정
        setConfirmErrorDialog(true);
        return; // 닉네임 추가를 중단
      }

      // trim()으로 문자열 뒤 공백 제거
      const trimmedNickname = inputAddNickname.trim();

      // 추가된 닉네임 배열에 빈 문자열이 있는지 확인
      if (trimmedNickname === "") {
        return;
      }

      // response의 상태 코드가 409(중복)라면
      if (response.status !== 409) {
        setNonExistDialog(true); // 존재하지 않는 닉네임 추가하려 하면 오류 띄우기
      } else {
        // 이미 추가한 닉네임 중 중복된 닉네임이 없으면 추가
        if (additionalParticipants.includes(trimmedNickname)) {
          setDuplicateBlankErrorDialog(true); // 이미 추가한 닉네임 추가하려 하면 오류 띄우기
          return;
        }

        // 미팅 정원 -1 이랑, 사용자가 추가하려는 인원 수 비교, 사 추 인이 적어야 추가 가능
        if (additionalParticipants.length >= numericInputMember - 1) {
          setCannotAddDialog(true); // 미팅 정원보다 많이 추가하려 하면 오류 띄우기
          return;
        }

        // 닉네임이 myNickname과 같은지 확인
        if (trimmedNickname === profile?.nickname) {
          setAddMyNicknameDialog(true); // 본인 닉네임 추가 못하게 막기
          return;
        }

        // 그렇지 않다면 추가된 닉네임 배열 끝에 inputAddNickname 추가
        setAdditionalParticipants([...additionalParticipants, trimmedNickname]);
        setInputAddNickname(""); // 추가 후 입력 필드를 지움
      }
    } catch (error) {
      console.error("비동기 작업 중 오류 발생!!!!", error);
      alert("서버 오류가 발생했습니다. 나중에 다시 시도해주세요.");
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
    setOverlapDialog(false);
    setShowEnrollBar(true);
  };

  // 등록 완료 스낵바 닫기
  const closeEnrollBar = () => {
    setShowEnrollBar(false);
  };

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
      await fetchMeeting({
        isUpdate,
        id,
        headers,
        meetingData: bodyData,
      });

      displayEnrollBar();
    } catch (error) {
      console.error("비동기 작업 중 오류 발생:", error);
      alert("서버 오류가 발생했습니다. 나중에 다시 시도해주세요.");

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
    setDuplicateBlankErrorDialog,
  };

  // 조건을 검사하고 미팅 등록 또는 수정 실행
  const onSubmitButtonClick = () => {
    if (validateForm(validationParameter)) {
      // currentParticipantsCount가 additionalParticipants의 길이와 같은지 확인
      if (currentParticipantsCount + 1 !== numericInputMember) {
        submitMeeting();
      } else {
        // currentParticipantsCount가 additionalParticipants의 길이와 같은 경우
        setOverlapDialog(true);
      }
    }
  };

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showListener = Keyboard.addListener("keyboardWillShow", (info) => {
      setKeyboardHeight(info.keyboardHeight);
    });

    const hideListener = Keyboard.addListener("keyboardWillHide", () => {
      setKeyboardHeight(0);
    });

    return () => {
      // 리스너 제거
      showListener?.remove();
      hideListener?.remove();
    };
  }, []);

  const chattingInputDivStyle = {
    paddingBottom: keyboardHeight + "px",
  };
  return (
    <>
      <TopBar
        title={isUpdate ? "미팅 수정하기" : "미팅 만들기"}
        leftIcon={<ArrowbackIcon onClick={() => navigate(-1)} />}
      />
      <CreateMeetingDetailScreen style={chattingInputDivStyle}>
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
              setInputDisabled={setInputDisabled}
              setModiSVG={setModiSVG}
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
              setInputDisabled={setInputDisabled}
              setModiSVG={() => {
                setModiSVG(false);
              }}
            />
          )}

          {modiSVG && (
            <Overlay>
              <Dialog
                title="미팅 인원을 수정하시겠습니까?"
                contents="추가 인원 목록이 삭제됩니다."
                left="아니요"
                onLeftClick={() => {
                  setInputDisabled(true);
                  setModiSVG(false);
                }}
                right="예"
                onRightClick={() => {
                  setModiSVG(false);
                  onDeleteAllMembersClick();
                }}
              />
            </Overlay>
          )}
          {confirmErrorDialog && (
            <Overlay>
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
            <div className="flex items-center">
              <MyInputBoxSVG
                onClick={() => {}}
                label=""
                value={inputAddNickname}
                onChange={(e) => setInputAddNickname(e.target.value)}
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
          <Overlay>
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

        {nonExistDialog && (
          <Overlay>
            <DialogOneBtn
              title="존재하지 않는 닉네임이에요."
              contents=""
              onRightClick={() => {
                setNonExistDialog(false);
              }}
              right="닫기"
            />
          </Overlay>
        )}

        {cannotAddDialog && (
          <Overlay>
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

        {duplicateBlankErrorDialog && (
          <Overlay>
            <DialogOneBtn
              title="닉네임을 확인해 주세요."
              contents="중복된 닉네임이나 빈칸이 있어요."
              onRightClick={() => {
                setDuplicateBlankErrorDialog(false);
              }}
              right="닫기"
            />
          </Overlay>
        )}

        {overlapDialog && (
          <Overlay>
            <DialogOneBtn
              title="미팅 정원과 참여자의 수가 같아요."
              contents=""
              onRightClick={() => {
                setOverlapDialog(false);
              }}
              right="닫기"
            />
          </Overlay>
        )}

        {showEnrollBar && (
          <Overlay>
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

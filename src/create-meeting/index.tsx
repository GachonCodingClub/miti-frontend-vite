import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { meetingDescAtom, meetingTitleAtom } from "../atoms";
import { Overlay } from "../sign-up/styles/detailComponents";
import { DialogOneBtn } from "../components/styles/Button";
import { MyInputBox } from "../components/MyInputBox";
import { getApi } from "../api/getApi";
import { useQuery } from "react-query";
import { ArrowbackIcon } from "../components/styles/Icons";
import { TopBarNextButton } from "../components/TopBar";
import { useParams, useNavigate } from "react-router-dom";
import {
  InputWrapper,
  DescriptionArea,
} from "./styles/createMeetingIndexComponents";
import { Screen } from "../components/styles/Screen";

export default function CreateMeeting() {
  const navigate = useNavigate();
  const { id } = useParams(); // 수정하기를 눌렀을 때. 이 때에는 id를 받음

  const isUpdate = !!id; // id가 있으면 isUpdate가 true

  // 원래 방 정보 가져오기
  const getGroup = async () => {
    try {
      // getApi 함수를 사용하여 외부 API에서 데이터를 가져옴
      // API 엔드포인트 경로는 `/groups/${id}`로 지정되며, id는 외부에서 전달되는 매개변수
      const response = await getApi({ link: `/groups/${id}` });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching group data:", error);
      alert("서버 오류가 발생했습니다. 나중에 다시 시도해주세요.");
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

  // 미팅 제목 입력 받기
  const [inputMeetingTitle, setInputMeetingTitle] = useState("");
  const [meetingTitleError, setMeetingTitleError] = useState("");

  const onMeetingTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setInputMeetingTitle(newTitle);
  };
  // 미팅 제목 recoil에 저장
  const [, setRecoilTitle] = useRecoilState(meetingTitleAtom);

  // 미팅 설명 입력 받기
  const [inputMeetingDesc, setInputMeetingDesc] = useState("");
  const [meetingDescError, setMeetingDescError] = useState("");

  const onMeetingDescChange = (e: { target: { value: string } }) => {
    const newDesc = e.target.value;
    setInputMeetingDesc(newDesc);
  };

  // isUpdate가 true일 경우
  useEffect(() => {
    if (isUpdate) {
      setInputMeetingTitle(group?.title);
      setInputMeetingDesc(group?.description);
    }
  }, [group?.description, group?.title, isUpdate]);

  // 미팅 설명 recoil에 저장
  const [, setRecoilDesc] = useRecoilState(meetingDescAtom);

  const [showDialog, setShowDialog] = useState(false);
  // 다음 버튼, 제목과 설명을 atom에 저장
  const nextButton = async () => {
    // 제목과 설명이 공백인지 검사
    setMeetingTitleError(
      inputMeetingTitle === "" ? "미팅 제목을 입력하세요" : ""
    );
    setMeetingDescError(
      inputMeetingDesc === "" ? "미팅 설명을 입력하세요" : ""
    );

    // 오류가 없다면 Recoil 상태를 업데이트
    if (inputMeetingTitle !== "" && inputMeetingDesc !== "") {
      // recoil에 제목과 설명 저장
      setRecoilTitle(inputMeetingTitle);
      setRecoilDesc(inputMeetingDesc);
      // 여기서 비동기 작업을 수행하고, 작업이 완료된 후에 홈으로 이동
      try {
        // Recoil 상태를 업데이트한 후 링크 이동
        navigate(
          isUpdate ? `/edit-meeting/${id}/detail` : "/create-meeting/detail"
        );
      } catch (error) {
        // 오류 처리
        console.error("비동기 작업 중 오류 발생:", error);
        alert("서버 오류가 발생했습니다. 나중에 다시 시도해주세요.");
        setShowDialog(true);
      }
    } else {
      setShowDialog(true);
    }
  };
  // useEffect를 사용해서 showDialog가 상태에 따라 실시간으로 업데이트 되게 함
  // 그렇지 않으면 다음 버튼 두 번 눌러야 작동함
  useEffect(() => {
    if (meetingTitleError || meetingDescError) {
      setShowDialog(true);
    } else {
      setShowDialog(false);
    }
  }, [meetingTitleError, meetingDescError]);

  return (
    <>
      <TopBarNextButton
        title={isUpdate ? "미팅 수정하기" : "미팅 만들기"}
        leftIcon={<ArrowbackIcon onClick={() => navigate(-1)} />}
        onRightIconClick={nextButton}
      />
      <Screen>
        <InputWrapper>
          <MyInputBox
            label="미팅 제목"
            placeholder=""
            type="text"
            value={inputMeetingTitle}
            onChange={onMeetingTitleChange}
            error={meetingTitleError}
            maxLength={20}
          />

          <DescriptionArea
            placeholder="미팅 설명"
            onChange={onMeetingDescChange}
            value={inputMeetingDesc}
            maxLength={35}
          />
          {showDialog && (
            <Overlay>
              <DialogOneBtn
                title="글자 수를 확인해 주세요."
                contents=""
                onRightClick={() => {
                  setShowDialog(false);
                }}
                right="닫기"
              />
            </Overlay>
          )}
        </InputWrapper>
      </Screen>
    </>
  );
}

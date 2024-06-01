import { useState, useEffect } from "react";
import { CharCount } from "../sign-up/styles/detailComponents";
import { MyInputBox } from "../components/MyInputBox";
import { getApi } from "../api/getApi";
import { useQuery } from "react-query";
import { TopBarNextButton } from "../components/TopBar";
import { useParams, useNavigate } from "react-router-dom";
import {
  InputWrapper,
  DescriptionArea,
} from "./styles/createMeetingIndexComponents";
import { Screen } from "../components/styles/Screen";
import { useOneBtnDialog } from "../hooks/useOntBtnDialog";
import { Dialog } from "../components/Dialog";

export default function CreateMeeting() {
  const navigate = useNavigate();
  const { id } = useParams(); // 수정하기를 눌렀을 때. 이 때에는 id를 받음

  const isUpdate = !!id; // id가 있으면 isUpdate가 true

  const { oneBtnDialog, showOneBtnDialog, hideOneBtnDialog } =
    useOneBtnDialog();

  // 원래 방 정보 가져오기
  const getGroup = async () => {
    if (isUpdate) {
      try {
        // getApi 함수를 사용하여 외부 API에서 데이터를 가져옴
        // API 엔드포인트 경로는 `/groups/${id}`로 지정되며, id는 외부에서 전달되는 매개변수
        const response = await getApi({ link: `/groups/${id}` });
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching group data:", error);
        showOneBtnDialog("서버 오류가 발생했어요. 나중에 다시 시도해주세요.");
        throw error; // 에러를 상위로 전파
      }
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
      enabled: !!id, // id가 존재할 때에만 데이터를 가져오도록 설정
    }
  );

  const [titleCount, setTitleCount] = useState(0);
  const [descCount, setDescCount] = useState(0);

  // 미팅 제목 입력 받기
  const [inputMeetingTitle, setInputMeetingTitle] = useState(
    localStorage.getItem("inputMeetingTitle") || ""
  );
  const [meetingTitleError, setMeetingTitleError] = useState("");

  const onMeetingTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setInputMeetingTitle(newTitle);
    setTitleCount(newTitle.length);
    localStorage.setItem("inputMeetingTitle", newTitle);
  };

  // 미팅 설명 입력 받기
  const [inputMeetingDesc, setInputMeetingDesc] = useState(
    localStorage.getItem("inputMeetingDesc") || ""
  );
  const [meetingDescError, setMeetingDescError] = useState("");

  const onMeetingDescChange = (e: { target: { value: string } }) => {
    const newDesc = e.target.value;
    setInputMeetingDesc(newDesc);
    setDescCount(newDesc.length);
    localStorage.setItem("inputMeetingDesc", newDesc);
  };

  // isUpdate가 true일 경우
  useEffect(() => {
    if (isUpdate) {
      setInputMeetingTitle(group?.title);
      setInputMeetingDesc(group?.description);
    }
  }, [group?.description, group?.title, isUpdate]);

  // 다음 버튼, 제목과 설명을 atom에 저장
  const nextButton = async () => {
    // 제목과 설명이 공백인지 검사
    setMeetingTitleError(
      inputMeetingTitle === "" ? "미팅 제목을 입력하세요" : ""
    );
    setMeetingDescError(
      inputMeetingDesc.length >= 10 ? "" : "미팅 설명은 10자 이상 입력해주세요"
    );

    // 오류가 없다면 Recoil 상태를 업데이트
    if (inputMeetingTitle !== "" && inputMeetingDesc !== "") {
      // 여기서 비동기 작업을 수행하고, 작업이 완료된 후에 홈으로 이동
      try {
        // Recoil 상태를 업데이트한 후 링크 이동
        navigate(
          isUpdate ? `/edit-meeting/${id}/detail` : "/create-meeting/detail"
        );
      } catch (error) {
        // 오류 처리
        console.error("비동기 작업 중 오류 발생:", error);
        showOneBtnDialog("서버 오류가 발생했어요. 나중에 다시 시도해주세요.");
      }
    } else {
      showOneBtnDialog("제목과 설명을 확인해주세요");
    }
  };
  // useEffect를 사용해서 showDialog가 상태에 따라 실시간으로 업데이트 되게 함
  // 그렇지 않으면 다음 버튼 두 번 눌러야 작동함
  useEffect(() => {
    if (meetingTitleError || meetingDescError) {
      showOneBtnDialog("제목과 설명을 확인해 주세요.");
    } else {
      hideOneBtnDialog();
    }
  }, [meetingTitleError, meetingDescError]);

  return (
    <>
      <TopBarNextButton
        title={isUpdate ? "미팅 수정하기" : "미팅 만들기"}
        onRightIconClick={nextButton}
      />
      <Screen>
        <InputWrapper>
          <div>
            부적절하거나 불쾌감을 줄 수 있는 컨텐츠는 제재를 받을 수 있습니다.
          </div>
          <div className="w-full">
            <MyInputBox
              label="미팅 제목"
              placeholder=""
              type="text"
              value={inputMeetingTitle}
              onChange={onMeetingTitleChange}
              error={meetingTitleError}
              maxLength={20}
            />
            {titleCount >= 0 && (
              <div className="flex justify-end">
                <CharCount>
                  {titleCount} / {20}
                </CharCount>
              </div>
            )}
          </div>
          <div className="text-[14px] text-[#767170] tracking-[-0.224px]">
            미팅 설명
          </div>
          <div className="w-full">
            <DescriptionArea
              placeholder="미팅 설명"
              onChange={onMeetingDescChange}
              value={inputMeetingDesc}
              maxLength={35}
            />
            {descCount >= 0 && (
              <div className="flex justify-end">
                <CharCount>
                  {descCount} / {35}
                </CharCount>
              </div>
            )}
          </div>

          {oneBtnDialog.open && (
            <Dialog
              isOneBtn
              title={oneBtnDialog.title}
              onRightClick={hideOneBtnDialog}
              right="닫기"
            />
          )}
        </InputWrapper>
      </Screen>
    </>
  );
}

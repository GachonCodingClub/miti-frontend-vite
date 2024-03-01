import { useNavigate } from "react-router-dom";
import { TopBar } from "../components/TopBar";
import { ArrowbackIcon } from "../components/styles/Icons";
import {
  WithdrawalContents,
  WithdrawalScreen,
  WithdrawalTitle,
} from "../profile/styles/withdrawalStyle";
import {
  Dialog,
  FixedButtonBox,
  LongOrangeBtn,
} from "../components/styles/Button";
import { Overlay } from "../sign-up/styles/detailComponents";
import { useState } from "react";
import { MyInputBox } from "../components/MyInputBox";
import { DescriptionArea } from "../create-meeting/styles/createMeetingIndexComponents";
import { getHeaders } from "../components/getHeaders";
import { useLocalStorageToken } from "../hooks/useLocalStorageToken";

export default function Report() {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);

  const token = useLocalStorageToken();

  const [nickname, setNickname] = useState("");
  const onNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputNickname = e.target.value;
    setNickname(inputNickname);
  };

  const [content, setContent] = useState("");
  const onContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputContent = e.target.value;
    setContent(inputContent);
  };

  const bodyData = JSON.stringify({
    targetUserNickname: nickname,
    content: content,
  });

  const headers = getHeaders(token);
  const onReportClick = () => {
    const ReportURL = `${import.meta.env.VITE_BASE_URL}/report`;
    fetch(ReportURL, {
      method: "POST",
      mode: "cors",
      headers: headers,
      body: bodyData,
    })
      .then((response) => {
        if (!response.ok) {
          console.error(
            `API 오류: ${response.status} - ${response.statusText}`
          );
          if (response.status === 404) {
            alert("대상의 닉네임을 다시 확인해주세요.");
          }
        }
        return response.json();
      })
      .then((error) => {
        alert("오류가 발생했습니다. 나중에 다시 시도해주세요.");
        console.error(error);
      });
    navigate(-1);
  };
  return (
    <>
      <TopBar
        title="신고하기"
        leftIcon={<ArrowbackIcon onClick={() => navigate(-1)} />}
      />
      <WithdrawalScreen>
        <div className="mt-7">
          <WithdrawalTitle>신고하기</WithdrawalTitle>
        </div>
        <div className="mt-4">
          <MyInputBox
            label="신고 대상 닉네임"
            value={nickname}
            onChange={onNicknameChange}
            placeholder="신고할 대상의 닉네임을 정확히 입력해주세요."
            type="text"
          />
        </div>

        <div className="gap-5">
          <WithdrawalContents>신고 내용</WithdrawalContents>
          <DescriptionArea
            placeholder="내용 입력"
            onChange={onContentChange}
            value={content}
          />
        </div>
        {showDialog && (
          <Overlay>
            <Dialog
              title="신고하시겠습니까?"
              contents=""
              left="아니요"
              right="예"
              onLeftClick={() => {
                setShowDialog(false);
              }}
              onRightClick={onReportClick}
            />
          </Overlay>
        )}
      </WithdrawalScreen>
      <FixedButtonBox>
        <LongOrangeBtn
          text="신고하기"
          onClick={() => {
            setShowDialog(true);
          }}
        />
      </FixedButtonBox>
    </>
  );
}

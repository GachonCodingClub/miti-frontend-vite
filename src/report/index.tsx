import { useNavigate } from "react-router-dom";
import { TopBar } from "../components/TopBar";
import { ArrowbackIcon } from "../components/styles/Icons";
import {
  WithdrawalContents,
  WithdrawalScreen,
} from "../profile/styles/withdrawalStyle";
import { FixedButtonBox, LongOrangeBtn } from "../components/styles/Button";
import { useState } from "react";
import { MyInputBox } from "../components/MyInputBox";
import { DescriptionArea } from "../create-meeting/styles/createMeetingIndexComponents";
import { getHeaders } from "../components/getHeaders";
import { useLocalStorageToken } from "../hooks/useLocalStorageToken";
import { Dialog } from "../components/Dialog";
import { useOneBtnDialog } from "../hooks/useOntBtnDialog";

export default function Report() {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);

  const token = useLocalStorageToken();

  const { oneBtnDialog, showOneBtnDialog, hideOneBtnDialog } =
    useOneBtnDialog();

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
            setShowDialog(false);
            showOneBtnDialog("대상의 닉네임을 다시 확인해주세요");
          } else {
            showOneBtnDialog(
              "신고 접수에 실패했어요. 나중에 다시 시도해주세요"
            );
          }
          throw new Error("Response not ok");
        }
        setShowDialog(false);
        showOneBtnDialog(
          "신고가 접수되었습니다. 검토까지는 최대 24시간이 소요됩니다"
        );
        setNickname("");
        setContent("");
        return response.json();
      })
      .then((error) => {
        console.error(error);
        showOneBtnDialog("오류가 발생했어요. 나중에 다시 시도해주세요");
      });
  };
  return (
    <>
      <TopBar
        title="신고하기"
        leftIcon={<ArrowbackIcon onClick={() => navigate(-1)} />}
      />
      <WithdrawalScreen>
        <div className="mt-10">
          <MyInputBox
            label="신고 대상 닉네임"
            value={nickname}
            onChange={onNicknameChange}
            placeholder="신고할 대상의 닉네임을 정확히 입력해주세요"
            type="text"
          />
        </div>

        <div>
          <WithdrawalContents>신고 내용</WithdrawalContents>
          <DescriptionArea
            placeholder="내용 입력"
            onChange={onContentChange}
            value={content}
          />
        </div>
        <div className="mt-7">
          <p className="mt-7">
            신고가 누적된 사용자는 <br /> 미티 서비스를 이용하실 수 없습니다.
          </p>
          <p className="mt-1">
            저희는 신고 내용을 최대 24시간 이내에 검토하고 신고 대상에게 적절한
            제재를 가합니다.
          </p>
        </div>

        {showDialog && (
          <Dialog
            title="신고하시겠습니까?"
            contents="허위 신고는 제재를 당할 수 있어요"
            left="아니요"
            right="예"
            onLeftClick={() => {
              setShowDialog(false);
            }}
            onRightClick={onReportClick}
          />
        )}

        {oneBtnDialog.open && (
          <Dialog
            title={oneBtnDialog.title}
            right="확인"
            isOneBtn
            onRightClick={hideOneBtnDialog}
          />
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

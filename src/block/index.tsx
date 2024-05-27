import { useNavigate } from "react-router-dom";
import { useLocalStorageToken } from "../hooks/useLocalStorageToken";
import { getHeaders } from "../components/getHeaders";
import { TopBar } from "../components/TopBar";
import { ArrowbackIcon } from "../components/styles/Icons";
import { BlockListScreen } from "./styles/BlockListComponents";
import { MyInputBox } from "../components/MyInputBox";
import { SettingButton } from "../profile/styles/settingComponents";
import { ROUTES } from "../routes";
import { LongOrangeBtn } from "../components/styles/Button";
import { useState } from "react";
import { useOneBtnDialog } from "../hooks/useOntBtnDialog";
import { Dialog } from "../components/Dialog";

export default function Block() {
  const navigate = useNavigate();
  const token = useLocalStorageToken();
  const headers = getHeaders(token);
  const [blockName, setBlockName] = useState("");

  const { oneBtnDialog, showOneBtnDialog, hideOneBtnDialog } =
    useOneBtnDialog();

  const onBlockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setBlockName(newName);
  };

  const onBlockClick = () => {
    const PostUrl = `${
      import.meta.env.VITE_BASE_URL
    }/users/block?blockTargetNickname=${blockName}`;

    fetch(PostUrl, {
      method: "POST",
      mode: "cors",
      headers: headers,
    })
      .then((response) => {
        if (!response.ok) {
          console.error(
            `API 오류 : ${response.status} - ${response.statusText}`
          );

          if (response.status === 404) {
            showOneBtnDialog("닉네임을 확인해 주세요");
          } else if (response.status === 409) {
            showOneBtnDialog("이미 차단한 사용자예요");
          } else {
            showOneBtnDialog(
              "서버 오류가 발생했어요. 나중에 다시 시도해주세요"
            );
          }
          return response.json();
        }
        showOneBtnDialog("해당 유저를 차단했어요");
        return response.json();
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <>
      <TopBar
        leftIcon={<ArrowbackIcon onClick={() => navigate(-1)} />}
        title="차단하기"
      />
      <BlockListScreen>
        <div>
          <p>차단할 유저의 닉네임을 입력해주세요</p>
          <MyInputBox
            label=""
            value={blockName}
            onChange={onBlockChange}
            placeholder="차단할 유저의 닉네임을 입력하고 버튼을 눌러주세요"
            type="text"
          />
          <div className="my-8">
            <LongOrangeBtn
              text="차단하기"
              onClick={() => {
                onBlockClick();
              }}
            />
          </div>
        </div>
        <div>
          <SettingButton to={`${ROUTES.BLOCKLIST}`}>
            차단 유저 목록으로 이동
          </SettingButton>
        </div>

        {oneBtnDialog.open && (
          <Dialog
            title={oneBtnDialog.title}
            right="확인"
            isOneBtn
            onRightClick={hideOneBtnDialog}
          />
        )}
      </BlockListScreen>
    </>
  );
}

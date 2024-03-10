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

export default function Block() {
  const navigate = useNavigate();
  const token = useLocalStorageToken();
  const headers = getHeaders(token);
  const [blockName, setBlockName] = useState("");

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
          alert("서버 오류가 발생했습니다. 나중에 다시 시도해주세요.");
          return response.json();
        }
        alert("해당 유저를 차단했어요.");
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
        <div className="py-8">
          <p>차단할 유저의 닉네임을 입력해주세요.</p>
          <p className="mt-3 mb-6">
            채팅에서 유저를 선택하고 직접 차단할 수도 있어요.
          </p>
          <MyInputBox
            label="차단하기"
            value={blockName}
            onChange={onBlockChange}
            placeholder="차단할 유저의 닉네임을 입력하고 버튼을 눌러주세요."
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
      </BlockListScreen>
    </>
  );
}

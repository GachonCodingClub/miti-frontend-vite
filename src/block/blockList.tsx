import { TopBar } from "../components/TopBar";
import { ArrowbackIcon } from "../components/styles/Icons";
import { useNavigate } from "react-router-dom";
import { Key } from "react";
import { SmallOrangeBtn } from "../components/styles/Button";
import { useGetBlockList } from "../api/blockList";
import { BUserBox, BlockListScreen } from "./styles/BlockListComponents";
import { UserName } from "../request-list/components/requestListComponents";
import { getHeaders } from "../components/getHeaders";
import { useLocalStorageToken } from "../hooks/useLocalStorageToken";
import { GrayLine } from "../meeting-chat-room/styles/SideMenuComponents";

export default function BlockList() {
  const navigate = useNavigate();

  const { data } = useGetBlockList();
  const token = useLocalStorageToken();

  const headers = getHeaders(token);

  const onUnblockClick = (blockUserId: string | undefined) => {
    const PostUrl = `${
      import.meta.env.VITE_BASE_URL
    }/users/${blockUserId}/unblock`;
    console.log("차단해제", blockUserId);
    fetch(PostUrl, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify({
        blockUserId: blockUserId,
      }),
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
        alert("해당 유저의 차단을 해제했어요.");
        navigate(-1);
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
        title="차단 유저 목록"
      />
      <BlockListScreen>
        {data?.blockedUserOutputs?.map(
          (
            block: { nickname: string; userId: string },
            index: Key | null | undefined
          ) => (
            <>
              <BUserBox key={index}>
                <UserName>{block?.nickname}</UserName>
                <div>
                  <SmallOrangeBtn
                    text="차단 해제"
                    onClick={() => {
                      onUnblockClick(block?.userId);
                    }}
                  />
                </div>
              </BUserBox>
              <GrayLine />
            </>
          )
        )}
      </BlockListScreen>
    </>
  );
}

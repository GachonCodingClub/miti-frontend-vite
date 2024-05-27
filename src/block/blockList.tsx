import { TopBar } from "../components/TopBar";
import { ArrowbackIcon } from "../components/styles/Icons";
import { useNavigate } from "react-router-dom";
import { Key } from "react";
import { SmallOrangeBtn } from "../components/styles/Button";
import { useGetBlockList } from "../api/blockList";
import { BlockListScreen } from "./styles/BlockListComponents";
import { UserName } from "../request-list/components/requestListComponents";
import { getHeaders } from "../components/getHeaders";
import { useLocalStorageToken } from "../hooks/useLocalStorageToken";
import { GrayLine } from "../meeting-chat-room/styles/SideMenuComponents";
import { useOneBtnDialog } from "../hooks/useOntBtnDialog";
import { Dialog } from "../components/Dialog";

export default function BlockList() {
  const navigate = useNavigate();

  const { data, refetch } = useGetBlockList();
  const token = useLocalStorageToken();

  const headers = getHeaders(token);
  const { oneBtnDialog, showOneBtnDialog, hideOneBtnDialog } =
    useOneBtnDialog();

  const onUnblockClick = (blockTargetNickname: string | undefined) => {
    const PostUrl = `${
      import.meta.env.VITE_BASE_URL
    }/users/unblock?blockTargetNickname=${blockTargetNickname}`;

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
          showOneBtnDialog("서버 오류가 발생했어요. 나중에 다시 시도해주세요.");
          return response.json();
        }
        showOneBtnDialog("해당 유저의 차단을 해제했어요.");
        refetch();
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
          (block: { nickname: string }, index: Key | null | undefined) => (
            <>
              <div className="flex w-full justify-between pt-4 p-0" key={index}>
                <UserName>{block?.nickname}</UserName>
                <div>
                  <SmallOrangeBtn
                    text="차단 해제"
                    onClick={() => {
                      onUnblockClick(block?.nickname);
                    }}
                  />
                </div>
              </div>
              <GrayLine />
            </>
          )
        )}

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

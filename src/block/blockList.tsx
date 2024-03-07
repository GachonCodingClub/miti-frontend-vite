import { TopBar } from "../components/TopBar";
import { ArrowbackIcon } from "../components/styles/Icons";
import { useNavigate } from "react-router-dom";
import { getApi } from "../api/getApi";
import { Key, useEffect } from "react";
import { SmallOrangeBtn } from "../components/styles/Button";
import { useGetBlockList } from "../api/blockList";
import { BUserBox, BlockListScreen } from "./styles/BlockListComponents";
import { UserName } from "../request-list/components/requestListComponents";

export default function BlockList() {
  const navigate = useNavigate();

  const { data } = useGetBlockList();

  const onUnblockClick = (blockUserId: string | undefined) => {
    console.log(blockUserId, "차단 해제");
    getApi({ link: `/users/${blockUserId}/unblock` }).then(() => {});
  };

  useEffect(() => {
    console.log(data.blockedUserOutputs);
  }, []);
  return (
    <>
      <TopBar
        leftIcon={<ArrowbackIcon onClick={() => navigate(-1)} />}
        title="차단 유저 목록"
      />
      <BlockListScreen>
        {data?.blockedUserOutputs?.map(
          (block: { nickname: string }, index: Key | null | undefined) => (
            <BUserBox key={index}>
              <UserName>{block?.nickname}</UserName>
              <div>
                <SmallOrangeBtn
                  text="차단 해제"
                  onClick={() => {
                    onUnblockClick(block?.nickname);
                  }}
                />
              </div>
            </BUserBox>
          )
        )}
      </BlockListScreen>
    </>
  );
}

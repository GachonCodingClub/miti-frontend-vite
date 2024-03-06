import styled from "styled-components";
import { TopBar } from "../components/TopBar";
import { ArrowbackIcon } from "../components/styles/Icons";
import { useNavigate } from "react-router-dom";
import { Screen } from "../components/styles/Screen";
import { getApi } from "../api/getApi";
import { useQuery } from "react-query";
import { useEffect } from "react";
import { getHeaders } from "../components/getHeaders";
import { useLocalStorageToken } from "../hooks/useLocalStorageToken";
import { SmallOrangeBtn } from "../components/styles/Button";

export const BlockListScreen = styled(Screen)`
  padding-top: 80px;
  padding-bottom: 112px;
`;

export default function BlockList() {
  const navigate = useNavigate();
  const token = useLocalStorageToken();
  const headers = getHeaders(token);

  const getBlockList = () =>
    getApi({ link: `/users/me/blocked-users` }).then((response) =>
      response.json()
    );

  const { data, isLoading, error } = useQuery(["myList"], getBlockList);

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
        {data?.blockedUserOutputs?.map((block: { nickname: string }) => (
          <>
            <div>{block?.nickname}</div>
            <div>
              <SmallOrangeBtn
                text="차단 해제"
                onClick={() => {
                  onUnblockClick(block?.nickname);
                }}
              />
            </div>
          </>
        ))}
      </BlockListScreen>
    </>
  );
}

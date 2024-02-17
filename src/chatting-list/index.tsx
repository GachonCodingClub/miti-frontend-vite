import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { TopBar } from "../components/TopBar";
import { TabBar } from "../components/TabBar";
import { getApi } from "../api/getApi";
import {
  TitleMemberTimeFrame,
  ChattingFrame,
  ChattingWrapper,
  LastMessages,
  TitleMemberFrame,
  TitleText,
  MemberText,
  TimeText,
  ChatAlertFrame,
  ChatText,
  AlertCircle,
  IGroup,
} from "./components/chattingListComponents";
import { PaddingScreen } from "../components/styles/Screen";
import ChattingListLayout from "./components/ChattingListLayout";

export default function ChattingList() {
  const getMyGroups = () =>
    getApi({ link: `/groups/my?page=0&size=99` }).then((response) =>
      response.json()
    );
  const { data, isLoading, error } = useQuery(["myGroups"], () =>
    getMyGroups()
  );

  const [lastMessages, setLastMessages] = useState<LastMessages>({});

  useEffect(() => {
    if (!isLoading && data?.content) {
      data?.content.forEach((group: { id: string }) => {
        const getChat = async (groupId: string) => {
          const chatData = await getApi({ link: `/message/${groupId}` }).then(
            (response) => response.json()
          );
          const lastMessage = chatData[chatData.length - 1];
          setLastMessages((prevMessages) => ({
            ...prevMessages,
            [group.id]: lastMessage,
          }));
        };
        getChat(group.id);
      });
    }
  }, [data, isLoading]);

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    if (isNaN(date.getTime())) {
      return ""; // 유효하지 않은 날짜인 경우 빈 문자열 반환
    }
    date.setHours(date.getHours() + 9);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  if (error) {
    return (
      <ChattingListLayout title="채팅">
        <div>에러가 발생했어요</div>
      </ChattingListLayout>
    );
  }

  if (isLoading) {
    return (
      <ChattingListLayout title="채팅">
        <div>로딩중이에요</div>
      </ChattingListLayout>
    );
  }

  const sortedData = data?.content?.sort((a: IGroup, b: IGroup) => a.id - b.id);
  return (
    <>
      <TopBar title="채팅" />
      <PaddingScreen>
        <ChattingWrapper>
          {sortedData?.map((group: IGroup, index: number) => (
            <ChattingFrame key={index} to={`/meeting-chat-room/${group?.id}`}>
              <TitleMemberTimeFrame>
                <TitleMemberFrame>
                  <TitleText>{group?.title}</TitleText>
                  <MemberText>{group?.nowUsers}</MemberText>
                </TitleMemberFrame>
                <TimeText>
                  {formatTime(lastMessages[group?.id]?.createdAt)}
                </TimeText>
              </TitleMemberTimeFrame>

              {/* 알림이 있을 경우 표시 */}
              <ChatAlertFrame>
                <ChatText>
                  {lastMessages[group?.id]?.content.replace("[MITI]", "")}
                </ChatText>
                <AlertCircle></AlertCircle>
              </ChatAlertFrame>
            </ChattingFrame>
          ))}
        </ChattingWrapper>
      </PaddingScreen>

      <TabBar />
    </>
  );
}

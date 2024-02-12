import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { TopBar } from "../components/TopBar";
import { TabBar } from "../components/TabBar";
import { getApi } from "../api/getApi";
import { Key } from "react";
import {
  TitleMemberTimeFrame,
  ChattingFrame,
  ChattingListScreen,
  ChattingWrapper,
  LastMessages,
  TitleMemberFrame,
  TitleText,
  MemberText,
  TimeText,
  ChatAlertFrame,
  ChatText,
  AlertCircle,
  AlertCount,
  Group,
} from "./components/chattingListComponents";

export default function ChattingList() {
  const page = 0;
  const pageSize = 99; // 페이지당 아이템 수

  const getMyGroups = (page: number, size: number) =>
    getApi({ link: `/groups/my?page=${page}&size=${size}` }).then((response) =>
      response.json()
    );

  const { data, isLoading } = useQuery(["myGroups", page, pageSize], () =>
    getMyGroups(page, pageSize)
  );

  const [lastMessages, setLastMessages] = useState<LastMessages>({});

  useEffect(() => {
    if (!isLoading && data?.content) {
      data.content.forEach((group: { id: string }) => {
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
  }, [data, isLoading, pageSize]);

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    if (isNaN(date.getTime())) {
      return ""; // 유효하지 않은 날짜인 경우 빈 문자열 반환
    }
    date.setHours(date.getHours() + 9); // 9시간을 더합니다.
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // 로딩 중일 때 보여줄 UI
  if (isLoading) {
    return (
      <>
        <TopBar title="채팅" />
        <ChattingListScreen>
          <div>로딩중이에요</div>
        </ChattingListScreen>
        <TabBar />
      </>
    );
  }

  // 데이터가 로딩된 후에 보여줄 UI
  const sortedData = data?.content?.sort((a: Group, b: Group) => a.id - b.id);

  return (
    <>
      <TopBar title="채팅" />
      <ChattingListScreen>
        <ChattingWrapper>
          {sortedData?.map((group: Group, index: Key) => (
            <ChattingFrame key={index} to={`/meeting-chat-room/${group.id}`}>
              <TitleMemberTimeFrame>
                <TitleMemberFrame>
                  <TitleText>{group.title}</TitleText>
                  <MemberText>{group.nowUsers}</MemberText>
                </TitleMemberFrame>
                <TimeText>
                  {formatTime(lastMessages[group.id]?.createdAt)}
                </TimeText>
              </TitleMemberTimeFrame>

              <ChatAlertFrame>
                <ChatText>
                  {lastMessages[group.id]?.content.replace("[MITI]", "")}
                </ChatText>
                <AlertCircle>
                  <AlertCount>10</AlertCount>
                </AlertCircle>
              </ChatAlertFrame>
            </ChattingFrame>
          ))}
        </ChattingWrapper>
      </ChattingListScreen>

      <TabBar />
    </>
  );
}

import { useState } from "react";
import { useQuery } from "react-query";
import { TopBar } from "../components/TopBar";
import { TabBar } from "../components/TabBar";
import { getApi } from "../api/getApi";
import { Key, useEffect } from "react";
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

  const { data } = useQuery(["myGroups", page, pageSize], () =>
    getMyGroups(page, pageSize)
  );

  const getChat = (groupId: string) =>
    getApi({ link: `/message/${groupId}` }).then((response) => response.json());

  const [lastMessages, setLastMessages] = useState<LastMessages>({});

  useEffect(() => {
    if (data?.content) {
      data.content.forEach((group: { id: string }) => {
        getChat(group.id).then((chatData) => {
          const lastMessage = chatData[chatData.length - 1];
          setLastMessages((prevMessages) => ({
            ...prevMessages,
            [group.id]: lastMessage,
          }));
        });
      });
    }
  }, [data, pageSize]);

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    if (isNaN(date.getTime())) {
      return ""; // 유효하지 않은 날짜인 경우 빈 문자열 반환
    }
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

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

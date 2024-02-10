import { TopBar } from "../components/TopBar";
import { TabBar } from "../components/TabBar";
import { useNavigate } from "react-router-dom";
import { getApi } from "../api/getApi";
import { useQuery } from "react-query";
import { Key, useEffect, useState } from "react";
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
} from "./components/chattingListComponents";

export default function ChattingList() {
  const navigate = useNavigate();

  const getMyGroups = () =>
    getApi({ link: "/groups/my" }).then((response) => response.json());
  const { data } = useQuery(["myGroups"], getMyGroups);

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
  }, [data]);

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
  return (
    <>
      <TopBar title="채팅" />
      <ChattingListScreen>
        <ChattingWrapper>
          {data?.content.map(
            (
              group: {
                title: string;
                nowUsers: string;
                id: string;
              },
              index: Key
            ) => (
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
            )
          )}
        </ChattingWrapper>
      </ChattingListScreen>
      <TabBar />
    </>
  );
}

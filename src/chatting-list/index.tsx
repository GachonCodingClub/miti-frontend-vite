import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import { TopBar } from "../components/TopBar";
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
  IGroup,
  AlertCircle,
  AlertCount,
} from "./components/chattingListComponents";
import { PaddingScreen } from "../components/styles/Screen";
import ChattingListLayout from "./components/ChattingListLayout";
import { useNavigate } from "react-router-dom";

export default function ChattingList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const getMyGroups = () =>
    getApi({ link: `/groups/my?page=0&size=99` }).then((response) =>
      response.json()
    );
  // useQuery를 통해 그룹 목록 가져오기 및 자동 새로고침 설정
  const { data, isLoading, error } = useQuery(["myGroups"], getMyGroups, {});

  const formatUnreadMessagesCount = (count: number) => {
    return count >= 100 ? "99+" : count.toString();
  };

  useEffect(() => {
    if (!isLoading && data?.content) {
      const totalUnread = data.content.reduce(
        (acc: number, curr: IGroup) => acc + (curr.unreadMessagesCount || 0),
        0
      );
      localStorage.setItem("totalUnreadMessages", totalUnread.toString());
    }
  }, [data, isLoading]);

  const [lastMessages, setLastMessages] = useState<LastMessages>({});

  useEffect(() => {
    if (!isLoading && data?.content) {
      const fetchLastMessages = async () => {
        const promises = data.content.map(async (group: { id: string }) => {
          const chatData = await getApi({
            link: `/message/${group.id}/page?page=0&size=1`,
          }).then((response) => response.json());
          const lastMessage = chatData[chatData.length - 1] || null;
          return { [group.id]: lastMessage };
        });

        const results = await Promise.all(promises);
        const newLastMessages = results.reduce(
          (acc, current) => ({
            ...acc,
            ...current,
          }),
          {}
        );
        setLastMessages(newLastMessages);
      };

      fetchLastMessages();
    }
  }, [data, isLoading, queryClient]);

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
  const getAlert = async (id: number) => {
    try {
      const res = await getApi({ link: `/message/${id}/refresh/last-read` });
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("알림 호출 오류:", error);
      setAlertError("데이터를 불러오는데 실패했어요.");
      throw error;
    }
  };

  const [alertError, setAlertError] = useState<string | null>(null);

  if (error || alertError) {
    return (
      <ChattingListLayout title="채팅">
        <div>{alertError || "에러가 발생했어요"}</div>{" "}
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

  const sortedData = data?.content?.sort(
    (a: { id: string | number }, b: { id: string | number }) => {
      const lastMessageA = lastMessages[a.id]?.createdAt || "";
      const lastMessageB = lastMessages[b.id]?.createdAt || "";
      return (
        new Date(lastMessageB).getTime() - new Date(lastMessageA).getTime()
      );
    }
  );
  return (
    <>
      <TopBar title="채팅" />
      <PaddingScreen>
        <ChattingWrapper>
          {sortedData?.map((group: IGroup, index: number) => (
            <ChattingFrame
              onClick={() => {
                getAlert(group?.id);
                navigate(`/meeting-chat-room/${group?.id}`);
              }}
              key={index}
            >
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
                  {lastMessages[group?.id]?.content.replace("[MITI]", "")
                    .length > 64
                    ? lastMessages[group?.id]?.content
                        .replace("[MITI]", "")
                        .substring(0, 64) + "..."
                    : lastMessages[group?.id]?.content.replace("[MITI]", "")}
                </ChatText>
                {(group?.unreadMessagesCount ?? 0) > 0 && (
                  <AlertCircle>
                    <AlertCount>
                      {formatUnreadMessagesCount(
                        group?.unreadMessagesCount ?? 0
                      )}
                    </AlertCount>
                  </AlertCircle>
                )}
              </ChatAlertFrame>
            </ChattingFrame>
          ))}
        </ChattingWrapper>
      </PaddingScreen>
    </>
  );
}

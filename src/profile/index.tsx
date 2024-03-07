import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getApi } from "../api/getApi";
import MeetingBoxComponent from "../components/MeetingBoxComponent";
import { cls } from "../utils";
import { TopBar } from "../components/TopBar";
import { SettingIcon } from "../components/styles/Icons";
import { IGroups } from "../model/group";
import { useNavigate } from "react-router-dom";
import {
  ProfileBox,
  ProfileInfo,
  ProfileMeetings,
  MeetingTabBar,
  HideFrame,
} from "./styles/profileStyle";
import { PaddingScreen } from "../components/styles/Screen";
import { SmallWhiteBtn } from "../components/styles/Button";
import { IParties } from "../model/party";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { useGetMyProfile } from "../api/profile";
import { InLoading } from "../components/InLoading";
import { ROUTES } from "../routes";

export default function Profile() {
  const [decodedToken, setDecodedToken] = useState<JwtPayload | null>(null);
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setDecodedToken(jwtDecode(storedToken + ""));
  }, []);

  const [isMine, setIsMine] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const navigate = useNavigate();

  const getMyGroups = () =>
    getApi({ link: "/groups/my?page=0&&size=30" }).then(
      (response) => response.json() as Promise<IGroups>
    );
  const { data, isLoading } = useQuery(["myGroups"], getMyGroups);

  const { data: profile } = useGetMyProfile();

  const getParties = () =>
    getApi({ link: `/groups/${selectedId}/parties` }).then(
      (response) => response.json() as Promise<IParties>
    );
  const {
    data: parties,
    isLoading: isLoadingParties,
    isError: isPartiesError,
  } = useQuery(["parties", selectedId], getParties, {
    enabled: !!selectedId,
  });

  const nowTime = new Date().getTime();

  const currentGroups = data?.content?.filter((group) => {
    const groupTime = new Date(group?.meetDate).getTime() + 9 * 60 * 60 * 1000;
    return groupTime > nowTime;
  });
  const sortedCurrentGroups = currentGroups?.sort((a, b) => a.id - b.id);

  const pastGroups = data?.content?.filter((group) => {
    const groupTime = new Date(group?.meetDate).getTime() + 9 * 60 * 60 * 1000;
    return groupTime < nowTime;
  });

  const sortedPastGroups = pastGroups?.sort((a, b) => a.id - b.id);

  const [showButton, setShowButton] = useState(false);

  const handleMeetingBoxClick = (groupId: number) => {
    // 선택된 미팅 ID가 현재 클릭된 것과 같다면, showButton을 토글.
    // 그렇지 않다면, 새로운 미팅 ID로 setSelectedId를 업데이트하고 showButton을 true로 설정한다.
    if (selectedId === groupId) {
      setShowButton((prev) => !prev);
    } else {
      setSelectedId(groupId);
      setShowButton(true); // 새로운 MeetingBoxComponent 클릭 시 항상 true로 설정
    }
  };

  const isLeader = decodedToken?.sub === parties?.leaderUserSummaryDto?.userId;

  if (isPartiesError) {
    return (
      <div>
        데이터를 불러오는 중 오류가 발생했어요. 나중에 다시 시도해 주세요.
      </div>
    );
  }
  return (
    !isLoading && (
      <>
        <TopBar
          title="프로필"
          rightIcon={
            <SettingIcon
              onClick={() => navigate(`${ROUTES.PORFILE_SETTING}`)}
            />
          }
        />
        <PaddingScreen>
          <ProfileBox>
            <ProfileInfo>
              <span className="font-medium text-base text-gray-800">
                {profile?.nickname}
              </span>
              <div className="flex gap-2 font-normal text-sm text-gray-500">
                <span>{profile?.age}살</span>
                <span>{profile?.gender === "MALE" ? "남자" : "여자"}</span>
                <span>{profile?.height}cm</span>
                <span>{profile?.weight}kg</span>
              </div>
            </ProfileInfo>
            <span className="font-normal text-xs text-gray-800">
              {profile?.description}
            </span>
          </ProfileBox>
          {/* 미팅리스트 */}
          <ProfileMeetings>
            <MeetingTabBar>
              <div
                onClick={() => setIsMine(true)}
                className={cls(
                  "p-[10px] pb-[9px] mb-[-1px]",
                  isMine
                    ? "text-gray-800 border-b-[1px] border-gray-800"
                    : "text-gray-500"
                )}
              >
                내 미팅
              </div>
              <div
                onClick={() => setIsMine(false)}
                className={cls(
                  "p-[10px] pb-[9px] mb-[-1px]",
                  isMine
                    ? "text-gray-500"
                    : "text-gray-800 border-b-[1px] border-gray-800"
                )}
              >
                지난 미팅
              </div>
            </MeetingTabBar>

            <div className="divide-x-[1px]">
              {isMine
                ? sortedCurrentGroups?.map((group) => {
                    const isLeaderForGroup =
                      decodedToken?.sub === group?.leaderUserSummaryDto.userId;
                    return (
                      <div key={group?.id}>
                        <MeetingBoxComponent
                          onClick={() => handleMeetingBoxClick(group.id)}
                          meeting={group}
                          isWaitingParty={group?.isWaitingParty}
                          isLeader={isLeaderForGroup}
                        />
                        {showButton && selectedId === group?.id && (
                          <HideFrame>
                            {isLeader && (
                              <>
                                <SmallWhiteBtn
                                  text="미팅 수정"
                                  onClick={() => {
                                    navigate(`/edit-meeting/${selectedId}`);
                                  }}
                                />

                                <div style={{ position: "relative" }}>
                                  <SmallWhiteBtn
                                    text="참여 요청 목록"
                                    onClick={() => {
                                      navigate(`/request-list/${selectedId}`);
                                    }}
                                  />
                                  {isLoadingParties ? (
                                    <InLoading />
                                  ) : (
                                    parties &&
                                    parties.waitingParties &&
                                    parties.waitingParties.length > 0 && (
                                      <div className="absolute w-3 h-3 rounded-full -top-0.5 -right-0.5 bg-[#FF7152]" />
                                    )
                                  )}
                                </div>
                              </>
                            )}

                            <SmallWhiteBtn
                              text="채팅방 이동"
                              onClick={() => {
                                navigate(`/meeting-chat-room/${selectedId}`);
                              }}
                            />
                          </HideFrame>
                        )}
                      </div>
                    );
                  })
                : sortedPastGroups?.map((group) => {
                    const isLeaderForGroup =
                      decodedToken?.sub === group?.leaderUserSummaryDto.userId;
                    return (
                      <div key={group?.id}>
                        <MeetingBoxComponent
                          onClick={() => handleMeetingBoxClick(group.id)}
                          isPast={true}
                          meeting={group}
                          isWaitingParty={group?.isWaitingParty}
                          isLeader={isLeaderForGroup}
                        />
                        {showButton && selectedId === group?.id && (
                          <HideFrame>
                            {isLeader && (
                              <>
                                <SmallWhiteBtn
                                  text="미팅 수정"
                                  onClick={() => {
                                    navigate(`/edit-meeting/${selectedId}`);
                                  }}
                                />
                                <SmallWhiteBtn
                                  text="참여 요청 목록"
                                  onClick={() => {
                                    navigate(`/request-list/${selectedId}`);
                                  }}
                                />
                              </>
                            )}

                            <SmallWhiteBtn
                              text="채팅방 이동"
                              onClick={() => {
                                navigate(`/meeting-chat-room/${selectedId}`);
                              }}
                            />
                          </HideFrame>
                        )}
                      </div>
                    );
                  })}
            </div>
          </ProfileMeetings>
        </PaddingScreen>
      </>
    )
  );
}

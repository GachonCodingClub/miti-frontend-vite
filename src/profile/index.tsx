import { TabBar } from "../components/TabBar";
import { useState } from "react";
import { useQuery } from "react-query";
import { getApi } from "../api/getApi";
import MeetingBoxComponent from "../components/MeetingBoxComponent";
import { cls } from "../utils";
import { TopBar } from "../components/TopBar";
import { SettingIcon } from "../components/Icons";
import { IGroups } from "../model/group";
import { useNavigate } from "react-router-dom";
import {
  ProfileScreen,
  ProfileBox,
  ProfileInfo,
  ProfileMeetings,
  MeetingTabBar,
  MeetingList,
} from "./components/profileStyle";

export default function Profile() {
  const [isMine, setIsMine] = useState(true);

  const navigate = useNavigate();

  const getMyGroups = () =>
    getApi({ link: "/groups/my" }).then(
      (response) => response.json() as Promise<IGroups>
    );
  const { data, isLoading } = useQuery(["myGroups"], getMyGroups);

  const getUserProfile = async () => {
    const response = await getApi({ link: `/users/profile/my` });
    const data = await response.json();
    return data;
  };
  const { data: profile } = useQuery(["profile"], getUserProfile);

  const nowTime = new Date().getTime();

  const currentGroups = data?.content?.filter((group) => {
    const groupTime = new Date(group.meetDate).getTime();
    return groupTime > nowTime;
  });
  const pastGroups = data?.content?.filter((group) => {
    const groupTime = new Date(group.meetDate).getTime();
    return groupTime < nowTime;
  });

  return (
    !isLoading && (
      <>
        <TopBar
          title="프로필"
          rightIcon={
            <SettingIcon onClick={() => navigate("/profile/setting")} />
          }
        />
        <ProfileScreen>
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
            <MeetingList>
              <div className="divide-x-[1px]">
                {isMine
                  ? currentGroups?.map((group, index) => (
                      <MeetingBoxComponent meeting={group} key={index} />
                    ))
                  : pastGroups?.map((group, index) => (
                      <MeetingBoxComponent
                        isPast={true}
                        meeting={group}
                        key={index}
                      />
                    ))}
              </div>
            </MeetingList>
          </ProfileMeetings>
        </ProfileScreen>
        <TabBar />
      </>
    )
  );
}

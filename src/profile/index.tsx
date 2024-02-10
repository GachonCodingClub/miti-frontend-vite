import styled from "styled-components";
import { Screen } from "../components/Screen";
import { TabBar } from "../components/TabBar";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getApi } from "../api/getApi";
import MeetingBoxComponent from "../components/MeetingBoxComponent";
import { cls } from "../utils";
import { TopBar } from "../components/TopBar";
import { SettingIcon } from "../components/Icons";
import { IGroups } from "../model/group";
import { useNavigate } from "react-router-dom";

const ProfileScreen = styled(Screen)`
  padding: 0;
  padding-top: 56px;
  padding-bottom: 64px;
`;

const ProfileBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 0 24px;
  margin-top: 24px;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ProfileMeetings = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 32px;
`;

const MeetingTabBar = styled.div`
  display: flex;
  padding: 0 24px;
  font-weight: 500;
  border-bottom: 1px solid #e9e9e9;
`;

const MeetingList = styled.div``;

export default function Profile() {
  const [isMine, setIsMine] = useState(true);
  const [nowDate, setNowDate] = useState("");
  useEffect(() => {
    const date = new Date();
    setNowDate(date.toString());
  }, [isMine]);

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

  useEffect(() => {
    console.log(data);
    console.log(profile);
  }, []);

  const currentGroups = data?.content?.filter((group) => {
    const date = group.meetDate;
    return date > nowDate;
  });
  const pastGroups = data?.content?.filter((group) => {
    const date = group.meetDate;
    return date < nowDate;
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
                <span>{profile.gender === "MALE" ? "남자" : "여자"}</span>
                <span>{profile.height}cm</span>
                <span>{profile.weight}kg</span>
              </div>
            </ProfileInfo>
            <span className="font-normal text-xs text-gray-800">
              {profile.description}
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

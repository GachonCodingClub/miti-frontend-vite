import { LongOrangeBtn } from "../../components/Button";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import { getApi } from "../../api/getApi";
import {
  ArrowbackIcon,
  DateIcon,
  LocationIcon,
  PersonIcon,
} from "../../components/Icons";
import { TopBar } from "../../components/TopBar";
import { useLoginGuard } from "../../hooks/useLoginGuard";
import { IGroup } from "../../model/group";
import { IParties } from "../../model/party";
import { ROUTES } from "../../routes";
import { getDate } from "../../utils";
import {
  DetailScreen,
  DetailBox,
  DetailTitle,
  DetailContents,
  DetailInfoBox,
  DetailInfo,
  DetailMember,
  MemberInfo,
  MemberDetail,
  JoinButtonBox,
} from "../components/meetingDetail.Components";
import { useNavigate, useParams } from "react-router-dom";

export default function MeetingDetail() {
  useLoginGuard();
  const navigate = useNavigate(); // useNavigate 사용
  const { id } = useParams();
  const [date, setDate] = useState("");
  const getGroup = () =>
    getApi({ link: `/groups/${id}` }).then(
      (response) => response.json() as Promise<IGroup>
    );
  const { data: group } = useQuery(["group", id], getGroup, {
    enabled: !!id,
  });
  const getParties = () =>
    getApi({ link: `/groups/${id}/parties` }).then(
      (response) => response.json() as Promise<IParties>
    );
  const { data: parties } = useQuery(["parties", id], getParties, {
    enabled: !!id,
  });
  useEffect(() => {
    if (group) {
      setDate(getDate(group.meetDate));
    }
  }, [group]);
  const onClick = () => {
    alert("미팅 참여 신청이 완료되었습니다.");
    navigate(`${ROUTES.MEETING_LIST}`);
  };
  // token을 없앴을 때 문제 없이 로그인 화면으로 가지 않고 에러가 생김
  if (group == null || parties == null) {
    console.log("a");
    return null;
  }
  console.log("b");
  return (
    <>
      <TopBar
        title="미팅 정보"
        leftIcon={<ArrowbackIcon onClick={() => navigate(-1)} />}
      />
      <DetailScreen>
        <DetailBox>
          <DetailTitle>
            <span className="text-base font-bold text-gray-800">
              {group.title}
            </span>
            <span className="text-sm font-normal text-gray-500">
              {group.description}
            </span>
          </DetailTitle>
          <div className="w-full h-2 bg-[#F2F0EF]" />
          <DetailContents>
            <DetailInfoBox>
              <span className="text-sm font-normal text-gray-500">
                세부 정보
              </span>
              <div className="flex flex-col gap-2">
                <DetailInfo>
                  <DateIcon />
                  <span className="font-medium">{date}</span>
                </DetailInfo>
                <DetailInfo>
                  <LocationIcon />
                  <span className="font-medium">{group.meetPlace}</span>
                </DetailInfo>
                <DetailInfo>
                  <PersonIcon />
                  <span className="font-normal">
                    {`${group.nowUsers}/${group.maxUsers}`}
                  </span>
                </DetailInfo>
              </div>
            </DetailInfoBox>
            <div className="w-full h-[1px] bg-[#EBE8E7]" />
            <DetailMember>
              <span className="text-sm font-normal text-gray-500">참여자</span>
              <MemberInfo>
                {parties?.acceptedParties?.map((party) => (
                  <div key={party.partyId}>
                    {party.users.map((user) => (
                      <div key={user.userId}>
                        <div className="flex gap-1 items-center">
                          <span>{user.userName}</span>
                          {user.userId === "1" /* party.leader.userId */ && (
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M9.58397 5.62404C9.78189 5.32717 10.2181 5.32717 10.416 5.62404L13.0308 9.54623C13.1935 9.79022 13.5302 9.8425 13.7592 9.65931L16.4282 7.52413C16.7926 7.2326 17.3223 7.55501 17.2308 8.01262L15.9137 14.5981C15.867 14.8318 15.6618 15 15.4234 15H4.57657C4.33823 15 4.13302 14.8318 4.08628 14.5981L2.76919 8.01262C2.67767 7.55501 3.20742 7.2326 3.57183 7.52413L6.24081 9.65931C6.46979 9.8425 6.80652 9.79022 6.96918 9.54623L9.58397 5.62404Z"
                                fill="#FF7152"
                              />
                            </svg>
                          )}
                        </div>
                        <MemberDetail>
                          <span>{user.age}살</span>
                          <span>
                            {user.gender === "MALE" ? "남자" : "여자"}
                          </span>
                          <span>{user.height}cm</span>
                          <span>{user.weight}kg</span>
                        </MemberDetail>
                      </div>
                    ))}
                  </div>
                ))}
              </MemberInfo>
            </DetailMember>
          </DetailContents>
          <JoinButtonBox>
            <LongOrangeBtn text="미팅 참여 신청" onClick={onClick} />
          </JoinButtonBox>
        </DetailBox>
      </DetailScreen>
    </>
  );
}

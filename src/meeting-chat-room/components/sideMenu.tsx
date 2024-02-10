import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { getApi } from "../../api/getApi";
import {
  DateIcon,
  LocationIcon,
  PersonIcon,
  OrangeCrownIcon,
} from "../../components/Icons";
import { getDate } from "../../utils";
import {
  MenuMeetingTitleAndDescFrame,
  MenuMeetingTitle,
  MenuMeetingDesc,
  GrayLine,
  MenuDetailAndMemberWrapper,
  MenuDetailAndButtonContainer,
  MenuDetailFrame,
  MenuDetailText,
  MenuDateLocationMemberContainer,
  MenuDateLocationFrame,
  MenuDateLocationText,
  MenuModifyMeetingButton,
  MenuSmallGrayLine,
  MenuMemberAndReqButtonWrapper,
  MenuMemberContainer,
  MenuMemberFrame,
  MenuUserProfileFrame,
  MenuMasterFrame,
  MenuUserNickname,
  MenuUserDetailFrame,
  MenuUserDetailText,
  ParticipationReqButton,
  MenuDeleteMeetingAndRunButton,
} from "./MeetingChatRoomComponents";
import { useNavigate, useParams } from "react-router-dom";
import { IParties } from "../../model/party";

interface ISideMenu {
  dialogProps: React.Dispatch<boolean>;
}

export default function SideMenu({ dialogProps }: ISideMenu) {
  const { id } = useParams();
  const navigate = useNavigate();
  // 메뉴 세부정보 가져오기
  const getGroup = async () => {
    try {
      // getApi 함수를 사용하여 외부 API에서 데이터를 가져옴
      // API 엔드포인트 경로는 `/groups/${id}`로 지정되며, id는 외부에서 전달되는 매개변수
      const response = await getApi({ link: `/groups/${id}` });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching group data:", error);
      throw error; // 에러를 상위로 전파
    }
  };

  // useQuery 훅을 사용하여 데이터를 가져오는 부분
  const { data: group } = useQuery(["group", id], getGroup, {
    enabled: !!id, // enabled 옵션을 사용하여 id가 존재할 때에만 데이터를 가져오도록 설정
  });

  const [date, setDate] = useState("");
  useEffect(() => {
    if (group) {
      setDate(getDate(group.meetDate));
    }
  }, [group]);

  const getParties = () =>
    getApi({ link: `/groups/${id}/parties` }).then(
      (response) => response.json() as Promise<IParties>
    );
  const { data: parties } = useQuery(["parties", id], getParties, {
    enabled: !!id,
  });

  useEffect(() => {
    console.log(group);
    console.log(parties);
  }, []);

  // #방장, 미팅 삭제하고 나가기
  // 다이얼로그

  return (
    <>
      {/* 제목과 설명 */}
      <MenuMeetingTitleAndDescFrame>
        <MenuMeetingTitle>{group.title}</MenuMeetingTitle>
        <MenuMeetingDesc>{group.description}</MenuMeetingDesc>
      </MenuMeetingTitleAndDescFrame>
      <GrayLine />
      <MenuDetailAndMemberWrapper>
        {/* 미팅 디테일 */}
        <MenuDetailAndButtonContainer>
          <MenuDetailFrame>
            <MenuDetailText>세부 정보</MenuDetailText>
            <MenuDateLocationMemberContainer>
              <MenuDateLocationFrame>
                <DateIcon />
                <MenuDateLocationText>{date}</MenuDateLocationText>
              </MenuDateLocationFrame>
              <MenuDateLocationFrame>
                <LocationIcon />
                <MenuDateLocationText>{group.meetPlace}</MenuDateLocationText>
              </MenuDateLocationFrame>
              <MenuDateLocationFrame>
                <PersonIcon />
                <MenuDateLocationText>
                  {group.nowUsers}명 / {group.maxUsers}명
                </MenuDateLocationText>
              </MenuDateLocationFrame>
            </MenuDateLocationMemberContainer>
          </MenuDetailFrame>
          <MenuModifyMeetingButton
            onClick={() => {
              navigate(`/edit-meeting/${id}`);
            }}
          >
            미팅 수정
          </MenuModifyMeetingButton>
        </MenuDetailAndButtonContainer>
      </MenuDetailAndMemberWrapper>
      <MenuSmallGrayLine />
      {/* 참여자 */}
      <MenuMemberAndReqButtonWrapper>
        <MenuMemberContainer>
          <MenuDetailText>참여자</MenuDetailText>
          <MenuMemberFrame>
            {/* 방장님 */}
            <MenuUserProfileFrame>
              <MenuMasterFrame>
                <MenuUserNickname>홍당무</MenuUserNickname>
                <OrangeCrownIcon />
              </MenuMasterFrame>
              <MenuUserDetailFrame>
                <div>
                  <MenuUserDetailText>24살</MenuUserDetailText>
                  <MenuUserDetailText>남자</MenuUserDetailText>
                  <MenuUserDetailText>170cm</MenuUserDetailText>
                  <MenuUserDetailText>80kg</MenuUserDetailText>
                </div>
              </MenuUserDetailFrame>
            </MenuUserProfileFrame>
            {/* 일반 참여자 */}
            <MenuUserProfileFrame>
              {parties?.acceptedParties?.map((party) => (
                <div key={party.partyId}>
                  {party.users.map((user) => (
                    <MenuUserDetailFrame key={user.userId}>
                      <MenuUserNickname>{user.userName}</MenuUserNickname>
                      <div>
                        <MenuUserDetailText>{user.age}살</MenuUserDetailText>
                        <MenuUserDetailText>
                          {user.gender === "MALE" ? "남자" : "여자"}
                        </MenuUserDetailText>
                        <MenuUserDetailText>{user.height}cm</MenuUserDetailText>
                        <MenuUserDetailText>{user.weight}kg</MenuUserDetailText>
                      </div>
                    </MenuUserDetailFrame>
                  ))}
                </div>
              ))}
            </MenuUserProfileFrame>
          </MenuMemberFrame>
        </MenuMemberContainer>
        <ParticipationReqButton
          onClick={() => {
            navigate(`/request-list/${id}`);
          }}
        >
          참여 요청 목록
        </ParticipationReqButton>
      </MenuMemberAndReqButtonWrapper>
      {/* 삭제하고 나가기 */}
      <MenuDeleteMeetingAndRunButton
        onClick={() => {
          dialogProps(true);
        }}
      >
        미팅 삭제하고 나가기
      </MenuDeleteMeetingAndRunButton>
    </>
  );
}

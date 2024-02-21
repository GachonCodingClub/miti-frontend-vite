import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { getApi } from "../../api/getApi";
import {
  DateIcon,
  LocationIcon,
  PersonIcon,
  OrangeCrownIcon,
} from "../../components/styles/Icons";

import { useNavigate, useParams } from "react-router-dom";
import { IParties } from "../../model/party";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { Overlay } from "../../sign-up/styles/detailComponents";
import {
  DialogBtnFrame,
  DialogContainer,
  DialogContents,
  DialogLeftText,
  DialogRightText,
  DialogTitle,
} from "../../components/styles/Button";
import { formatDate } from "../../utils";
import {
  IUser,
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
  MenuUserDetailText,
  MenuUserDetailFrame,
  ParticipationReqButton,
  MenuDeleteMeetingAndRunButton,
  MenuExitMeetingButton,
  ProfileLeftButton,
  ProfileRightButton,
} from "../styles/SideMenuComponents";

interface ISideMenu {
  dialogProps: React.Dispatch<boolean>;
  exitProps: React.Dispatch<boolean>;
}

export default function SideMenu({ dialogProps, exitProps }: ISideMenu) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [decodedToken, setDecodedToken] = useState<JwtPayload | null>(null);
  useEffect(() => {
    // 컴포넌트가 마운트될 때 localStorage에서 토큰을 가져와 상태에 설정
    const storedToken = localStorage.getItem("token");
    setDecodedToken(jwtDecode(storedToken + ""));
  }, []);

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
  const formattedDate = formatDate(group?.meetDate);

  const getParties = () =>
    getApi({ link: `/groups/${id}/parties` }).then(
      (response) => response.json() as Promise<IParties>
    );
  const { data: parties } = useQuery(["parties", id], getParties, {
    enabled: !!id,
  });

  useEffect(() => {
    console.log("그룹", decodedToken?.sub == group.leaderUserSummaryDto.userId);
    console.log(parties);
  }, []);

  const [selectedUserProfile, setSelectedUserProfile] = useState<IUser | null>(
    null
  );

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
                <MenuDateLocationText>{formattedDate}</MenuDateLocationText>
              </MenuDateLocationFrame>
              <MenuDateLocationFrame>
                <LocationIcon />
                <MenuDateLocationText>{group.meetPlace}</MenuDateLocationText>
              </MenuDateLocationFrame>
              <MenuDateLocationFrame>
                <PersonIcon />
                <MenuDateLocationText>
                  최대 인원 {group.maxUsers}명
                </MenuDateLocationText>
              </MenuDateLocationFrame>
            </MenuDateLocationMemberContainer>
          </MenuDetailFrame>
          {decodedToken?.sub == group?.leaderUserSummaryDto?.userId ? (
            <MenuModifyMeetingButton
              onClick={() => {
                navigate(`/edit-meeting/${id}`);
              }}
            >
              미팅 수정
            </MenuModifyMeetingButton>
          ) : null}
        </MenuDetailAndButtonContainer>
      </MenuDetailAndMemberWrapper>
      <MenuSmallGrayLine />
      {/* 참여자 */}
      <MenuMemberAndReqButtonWrapper>
        <MenuMemberContainer>
          <MenuDetailText>참여자</MenuDetailText>
          <MenuMemberFrame>
            {/* 방장님 */}
            {parties?.leaderUserSummaryDto && (
              <MenuUserProfileFrame>
                <MenuMasterFrame
                  onClick={() => {
                    setSelectedUserProfile(parties?.leaderUserSummaryDto);
                  }}
                >
                  <div className="flex gap-2">
                    <MenuUserNickname>
                      {parties?.leaderUserSummaryDto?.nickname}
                    </MenuUserNickname>
                    <OrangeCrownIcon />
                  </div>
                  <div>
                    <MenuUserDetailText>
                      {parties?.leaderUserSummaryDto?.age}살
                    </MenuUserDetailText>
                    <MenuUserDetailText>
                      {parties?.leaderUserSummaryDto?.gender === "MALE"
                        ? "남자"
                        : "여자"}
                    </MenuUserDetailText>
                  </div>
                </MenuMasterFrame>
              </MenuUserProfileFrame>
            )}
            {/* 일반 참여자 */}
            {parties?.acceptedParties?.map((party) => (
              <div key={party.partyId}>
                {party.users.map((user) => (
                  <MenuUserProfileFrame
                    key={user.userId}
                    onClick={() => {
                      setSelectedUserProfile(user);
                    }}
                  >
                    <MenuUserDetailFrame>
                      <MenuUserNickname>{user.nickname}</MenuUserNickname>
                      <div>
                        <MenuUserDetailText>{user.age}살</MenuUserDetailText>
                        <MenuUserDetailText>
                          {user.gender === "MALE" ? "남자" : "여자"}
                        </MenuUserDetailText>
                      </div>
                    </MenuUserDetailFrame>
                  </MenuUserProfileFrame>
                ))}
              </div>
            ))}
          </MenuMemberFrame>
        </MenuMemberContainer>
        {/* 참여 요청 목록 */}
        {decodedToken?.sub == group?.leaderUserSummaryDto?.userId ? (
          <ParticipationReqButton
            onClick={() => {
              navigate(`/request-list/${id}`);
            }}
          >
            참여 요청 목록
          </ParticipationReqButton>
        ) : null}
      </MenuMemberAndReqButtonWrapper>
      {/* 삭제하고 나가기 */}
      {decodedToken?.sub == group?.leaderUserSummaryDto?.userId ? (
        <MenuDeleteMeetingAndRunButton
          onClick={() => {
            dialogProps(true);
          }}
        >
          미팅 삭제하고 나가기
        </MenuDeleteMeetingAndRunButton>
      ) : (
        <MenuExitMeetingButton
          onClick={() => {
            exitProps(true);
          }}
        >
          미팅 나가기
        </MenuExitMeetingButton>
      )}

      {/* 선택한 유저 프로필 다이얼로그 */}
      {selectedUserProfile && (
        <Overlay style={{ zIndex: "31", whiteSpace: "pre-line" }}>
          <DialogContainer>
            <DialogTitle className="p-4">
              {selectedUserProfile?.nickname}
            </DialogTitle>
            <DialogContents>{selectedUserProfile?.description}</DialogContents>
            <div className="p-2 flex flex-col">
              <DialogContents className="mr-2">
                나이: {selectedUserProfile?.age}살
              </DialogContents>
              <DialogContents className="mr-2">
                성별: {selectedUserProfile?.gender === "MALE" ? "남자" : "여자"}
              </DialogContents>
              <DialogContents className="mr-2">
                키: {selectedUserProfile?.height}cm
              </DialogContents>
              <DialogContents className="mr-2">
                몸무게: {selectedUserProfile?.weight}kg
              </DialogContents>
            </div>
            <div>
              {decodedToken?.sub == group?.leaderUserSummaryDto?.userId ? (
                <DialogBtnFrame>
                  <ProfileLeftButton
                    onClick={() => {
                      setSelectedUserProfile(null);
                    }}
                  >
                    <DialogLeftText>닫기</DialogLeftText>
                  </ProfileLeftButton>
                  <ProfileRightButton
                    onClick={() => {
                      console.log("신고");
                    }}
                  >
                    <DialogRightText>신고하기</DialogRightText>
                  </ProfileRightButton>
                </DialogBtnFrame>
              ) : (
                <DialogBtnFrame>
                  <ProfileLeftButton
                    onClick={() => {
                      setSelectedUserProfile(null);
                    }}
                  >
                    <DialogLeftText>닫기</DialogLeftText>
                  </ProfileLeftButton>
                  <ProfileRightButton
                    onClick={() => {
                      console.log("신고");
                    }}
                  >
                    <DialogRightText>신고하기</DialogRightText>
                  </ProfileRightButton>
                </DialogBtnFrame>
              )}
            </div>
          </DialogContainer>
        </Overlay>
      )}
    </>
  );
}

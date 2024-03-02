import { useState, useEffect } from "react";
import {
  DateIcon,
  LocationIcon,
  PersonIcon,
  OrangeCrownIcon,
} from "../../components/styles/Icons";
import { useNavigate, useParams } from "react-router-dom";
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
  ISideMenu,
} from "../styles/SideMenuComponents";
import useGetGroups from "../../api/useGetGroups";
import useGetParties from "../../api/useGetParties";
import { InLoading } from "../../components/InLoading";

export default function SideMenu({ dialogProps, exitProps }: ISideMenu) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [decodedToken, setDecodedToken] = useState<JwtPayload | null>(null);
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setDecodedToken(jwtDecode(storedToken + ""));
  }, []);

  const {
    data: group,
    isLoading: isGroupLoading,
    error: groupError,
  } = useGetGroups(id);

  const formattedDate = formatDate(group?.meetDate);

  const {
    data: parties,
    isLoading: isPartiesLoading,
    error: partiesError,
  } = useGetParties(id);

  const isGroupLeader =
    decodedToken?.sub === group?.leaderUserSummaryDto?.userId;
  const [selectedUserProfile, setSelectedUserProfile] = useState<IUser | null>(
    null
  );

  if (isGroupLoading || isPartiesLoading) {
    return <InLoading />;
  }

  if (groupError || partiesError) {
    return (
      <div>
        데이터를 불러오는 중 오류가 발생했어요. 나중에 다시 시도해 주세요.
      </div>
    );
  }

  return (
    <>
      {/* 제목과 설명 */}
      <MenuMeetingTitleAndDescFrame>
        <MenuMeetingTitle>{group?.title}</MenuMeetingTitle>
        <MenuMeetingDesc>{group?.description}</MenuMeetingDesc>
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
                <MenuDateLocationText>{group?.meetPlace}</MenuDateLocationText>
              </MenuDateLocationFrame>
              <MenuDateLocationFrame>
                <PersonIcon />
                <MenuDateLocationText>
                  최대 인원 {group?.maxUsers}명
                </MenuDateLocationText>
              </MenuDateLocationFrame>
            </MenuDateLocationMemberContainer>
          </MenuDetailFrame>
          {isGroupLeader && (
            <MenuModifyMeetingButton
              onClick={() => {
                navigate(`/edit-meeting/${id}`);
              }}
            >
              미팅 수정
            </MenuModifyMeetingButton>
          )}
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
                {party?.users.map((user) => (
                  <MenuUserProfileFrame
                    key={user?.userId}
                    onClick={() => {
                      setSelectedUserProfile(user);
                    }}
                  >
                    <MenuUserDetailFrame>
                      <MenuUserNickname>{user?.nickname}</MenuUserNickname>
                      <div>
                        <MenuUserDetailText>{user?.age}살</MenuUserDetailText>
                        <MenuUserDetailText>
                          {user?.gender === "MALE" ? "남자" : "여자"}
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
        {isGroupLeader && (
          <ParticipationReqButton
            onClick={() => {
              navigate(`/request-list/${id}`);
            }}
          >
            참여 요청 목록
            {isPartiesLoading ? (
              <InLoading />
            ) : (
              parties &&
              parties.waitingParties &&
              parties.waitingParties.length > 0 && (
                <>
                  <div className="absolute w-4 h-4 rounded-full -top-1 -right-1 bg-[#FF7152]" />
                </>
              )
            )}
          </ParticipationReqButton>
        )}
      </MenuMemberAndReqButtonWrapper>
      {/* 삭제하고 나가기 */}
      {isGroupLeader ? (
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
                    navigate(`/report`);
                  }}
                >
                  <DialogRightText>신고하기</DialogRightText>
                </ProfileRightButton>
              </DialogBtnFrame>
            </div>
          </DialogContainer>
        </Overlay>
      )}
    </>
  );
}

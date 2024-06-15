import { useState, useEffect } from "react";
import {
  DateIcon,
  LocationIcon,
  PersonIcon,
  OrangeCrownIcon,
  ScrollDownIcon,
  ReportIcon,
} from "../../components/styles/Icons";
import { useNavigate, useParams } from "react-router-dom";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { Overlay } from "../../sign-up/styles/detailComponents";

import { formatDate } from "../../utils";
import {
  IUser,
  MenuMeetingTitleAndDescFrame,
  MenuMeetingTitle,
  MenuMeetingDesc,
  GrayLine,
  MenuDetailAndMemberWrapper,
  MenuDetailAndButtonContainer,
  MenuDetailText,
  MenuDateLocationFrame,
  MenuDateLocationText,
  MenuModifyMeetingButton,
  MenuSmallGrayLine,
  MenuMemberAndReqButtonWrapper,
  MenuMemberContainer,
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
  ScrollDownArrow,
} from "../styles/SideMenuComponents";
import useGetParties from "../../api/useGetParties";
import { InLoading } from "../../components/InLoading";
import { getHeaders } from "../../components/getHeaders";
import { useGetBlockList } from "../../api/blockList";
import { useQueryClient } from "react-query";
import { ROUTES } from "../../routes";
import { useGetGroups } from "../../api/useGetGroups";
import {
  DialogContainer,
  DialogTitle,
  DialogContents,
  DialogBtnFrame,
  DialogLeftText,
  DialogRightText,
  Dialog,
} from "../../components/Dialog";
import { useOneBtnDialog } from "../../hooks/useOntBtnDialog";
import { Linkify } from "../../utils/linkify";

export default function SideMenu({ dialogProps, exitProps }: ISideMenu) {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { oneBtnDialog, showOneBtnDialog, hideOneBtnDialog } =
    useOneBtnDialog();

  const [token, setToken] = useState("");
  const [decodedToken, setDecodedToken] = useState<JwtPayload | null>(null);
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setDecodedToken(jwtDecode(storedToken + ""));
    if (storedToken) {
      setToken(storedToken);
    }
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

  const headers = getHeaders(token);

  const [totalParticipants, setTotalParticipants] = useState(0);

  // parties 데이터가 로드될 때마다 인원 수를 업데이트
  useEffect(() => {
    const total =
      parties?.acceptedParties?.reduce(
        (acc, party) => acc + party.users.length,
        0
      ) || 0;
    setTotalParticipants(total + 1);
  }, [parties?.acceptedParties]);

  // 외부 링크 이동 다이얼로그
  const [linkDialog, setLinkDialog] = useState<{
    open: boolean;
    url: string | null;
  }>({ open: false, url: null });

  const handleLinkClick = (url: string) => {
    setLinkDialog({ open: true, url });
  };

  const [blockDialog, setBlockDialog] = useState<{
    open: boolean;
    user: IUser | null;
  }>({ open: false, user: null });

  const onBlockClick = (blockTargetNickname: string | undefined) => {
    const PostUrl = `${
      import.meta.env.VITE_BASE_URL
    }/users/block?blockTargetNickname=${blockTargetNickname}`;

    fetch(PostUrl, {
      method: "POST",
      mode: "cors",

      headers: headers,
    })
      .then((response) => {
        if (!response.ok) {
          console.error(
            `API 오류 : ${response.status} - ${response.statusText}`
          );
          if (response.status === 409) {
            showOneBtnDialog("이미 차단된 유저예요");
          } else {
            showOneBtnDialog(
              "서버 오류가 발생했어요. 나중에 다시 시도해주세요"
            );
          }
          return response.json();
        }
        showOneBtnDialog("해당 유저를 차단했어요");
        queryClient.invalidateQueries(["blocklist"]);
        return response.json();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const { data: blockData } = useGetBlockList();

  const renderUserProfile = (user: IUser, isUserBlocked: boolean) => {
    return isUserBlocked ? (
      <div className="pr-2 text-[#d05438]">차단된 사용자입니다</div>
    ) : (
      <MenuMasterFrame onClick={() => setSelectedUserProfile(user)}>
        <MenuUserNickname>{user?.nickname}</MenuUserNickname>
        <MenuUserDetailFrame>
          <MenuUserDetailText>{(user?.age ?? 0) + 1}살</MenuUserDetailText>
          <MenuUserDetailText>
            {user?.gender === "MALE" ? "남자" : "여자"}
          </MenuUserDetailText>
        </MenuUserDetailFrame>
      </MenuMasterFrame>
    );
  };

  if (isGroupLoading || isPartiesLoading) {
    return <InLoading />;
  }

  if (groupError || partiesError) {
    return (
      <div>
        데이터를 불러오는 중 오류가 발생했어요. 나중에 다시 시도해 주세요
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
          <div className="flex flex-col items-start gap-4">
            <MenuDetailText>세부 정보</MenuDetailText>
            <div className="flex flex-col items-start gap-2">
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
            </div>
          </div>
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
        <MenuDetailText>참여자 (총 {totalParticipants}명)</MenuDetailText>
        <MenuMemberContainer>
          <div className="flex flex-col items-start gap-2">
            {/* 방장님 */}
            {parties?.leaderUserSummaryDto && (
              <MenuUserProfileFrame>
                {renderUserProfile(
                  parties.leaderUserSummaryDto,
                  blockData?.blockedUserOutputs?.some(
                    (blockedUser: { nickname: string | undefined }) =>
                      blockedUser.nickname ===
                      parties.leaderUserSummaryDto?.nickname
                  )
                )}
                <OrangeCrownIcon />
              </MenuUserProfileFrame>
            )}
            {/* 일반 참여자 */}
            {parties?.acceptedParties?.map(
              (party) =>
                party &&
                party.users &&
                party.users.length > 0 && (
                  <div key={party.partyId}>
                    {party?.users.map((user) => {
                      // 차단된 사용자인지 확인
                      const isUserBlocked = blockData?.blockedUserOutputs?.some(
                        (blockedUser: { nickname: string | undefined }) =>
                          blockedUser.nickname === user?.nickname
                      );

                      return (
                        <MenuUserProfileFrame key={user?.userId}>
                          {renderUserProfile(user, isUserBlocked)}
                        </MenuUserProfileFrame>
                      );
                    })}
                  </div>
                )
            )}
          </div>
        </MenuMemberContainer>
        {/* 아래 화살표 */}
        <ScrollDownArrow>
          <ScrollDownIcon />
        </ScrollDownArrow>
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
        <Overlay style={{ whiteSpace: "pre-line" }}>
          <DialogContainer>
            <DialogTitle className="p-2 flex items-center">
              {selectedUserProfile?.nickname}
              {selectedUserProfile?.userId !== decodedToken?.sub && (
                <div
                  className="pl-4"
                  onClick={() => {
                    navigate(ROUTES.REPORT);
                  }}
                >
                  <ReportIcon />
                </div>
              )}
            </DialogTitle>

            <div className="pl-2 font-semibold self-start">
              <Linkify
                text={selectedUserProfile?.description || ""}
                onLinkClick={handleLinkClick}
              />
            </div>

            <div className="pl-2 pb-4 flex flex-col self-start">
              <div>
                <DialogContents className="mr-2">
                  나이: {(selectedUserProfile?.age ?? 0) + 1}살
                </DialogContents>
                <DialogContents className="mr-2">
                  성별:{" "}
                  {selectedUserProfile?.gender === "MALE" ? "남자" : "여자"}
                </DialogContents>
              </div>
              <div>
                <DialogContents className="mr-2">
                  키: {selectedUserProfile?.height}cm
                </DialogContents>
                <DialogContents className="mr-2">
                  몸무게: {selectedUserProfile?.weight}kg
                </DialogContents>
              </div>
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
                {selectedUserProfile?.userId !== decodedToken?.sub && (
                  <ProfileRightButton
                    onClick={() => {
                      setBlockDialog({ open: true, user: selectedUserProfile });
                      setSelectedUserProfile(null);
                    }}
                  >
                    <DialogRightText>차단하기</DialogRightText>
                  </ProfileRightButton>
                )}
              </DialogBtnFrame>
            </div>
          </DialogContainer>
        </Overlay>
      )}

      {oneBtnDialog.open && (
        <Dialog
          title={oneBtnDialog.title}
          right="확인"
          isOneBtn
          onRightClick={hideOneBtnDialog}
        />
      )}

      {blockDialog.open && (
        <Dialog
          title={`${blockDialog.user?.nickname}님을 차단하시겠어요?`}
          left="취소"
          onLeftClick={() => setBlockDialog({ open: false, user: null })}
          isRed
          right="예"
          onRightClick={() => {
            if (blockDialog.user) {
              onBlockClick(blockDialog.user.nickname);
              setBlockDialog({ open: false, user: null });
            }
          }}
        />
      )}

      {linkDialog.open && (
        <Dialog
          title="외부 링크로 이동하시겠어요?"
          left="취소"
          onLeftClick={() => setLinkDialog({ open: false, url: null })}
          right="예"
          onRightClick={() => {
            if (linkDialog.url) {
              window.open(linkDialog.url, "_blank"); // 새 탭에서 url 열기
              setLinkDialog({ open: false, url: null });
              setSelectedUserProfile(null);
            }
          }}
        />
      )}
    </>
  );
}

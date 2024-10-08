import { LongOrangeBtn, LongWhiteBtn } from "../../components/styles/Button";
import { useEffect, useRef, useState } from "react";
import { getApi } from "../../api/getApi";
import {
  ArrowbackIcon,
  DateIcon,
  LocationIcon,
  OrangeCrownIcon,
  PersonIcon,
  PlusIcon,
} from "../../components/styles/Icons";
import { TopBar } from "../../components/TopBar";
import { useLoginGuard } from "../../hooks/useLoginGuard";
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
import { Overlay } from "../../sign-up/styles/detailComponents";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { formatDate } from "../../utils";
import { getHeaders } from "../../components/getHeaders";
import { AddMemberButton } from "../../create-meeting/styles/createMeetingDetailComponents";
import { MyInputBoxSVG } from "../../components/MyInputBox";
import AdditionalParticipantsList from "../../create-meeting/components/additionalParticipantsList";
import useGetParties from "../../api/useGetParties";
import { useGetMyProfile } from "../../api/profile";
import { InLoading } from "../../components/InLoading";
import { useGetBlockList } from "../../api/blockList";
import { IUser } from "../../meeting-chat-room/styles/SideMenuComponents";
import { useGetGroups } from "../../api/useGetGroups";
import {
  Dialog,
  DialogBtnFrame,
  DialogContainer,
  DialogLeftBtn,
  DialogLeftText,
  DialogRightBtn,
  DialogRightText,
} from "../../components/Dialog";
import { useOneBtnDialog } from "../../hooks/useOntBtnDialog";
import { Linkify } from "../../utils/linkify";

export default function MeetingDetail() {
  useLoginGuard();
  const navigate = useNavigate();
  const { id } = useParams();

  const [token, setToken] = useState("");
  const [decodedToken, setDecodedToken] = useState<JwtPayload | null>(null);
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setDecodedToken(jwtDecode(storedToken + ""));
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const [successDialog, setSuccessDialog] = useState(false);

  const { oneBtnDialog, showOneBtnDialog, hideOneBtnDialog } =
    useOneBtnDialog();

  const {
    data: group,
    isLoading: isGroupLoading,
    error: groupError,
  } = useGetGroups(id);

  const {
    data: parties,
    isLoading: isPartiesLoading,
    error: partiesError,
  } = useGetParties(id);

  const { data: profile } = useGetMyProfile();

  const { data: blockData } = useGetBlockList();

  const meetingDate = group?.meetDate ? new Date(group?.meetDate) : null;
  const formattedDate = meetingDate ? formatDate(group?.meetDate) : "";

  // 닉네임으로 참여자 추가(선택 입력)
  const [additionalParticipants, setAdditionalParticipants] = useState<
    string[]
  >([]);
  const [inputAddNickname, setInputAddNickname] = useState("");

  const [showAdd, setShowAdd] = useState(false);

  const nowMember = (parties?.acceptedParties[0]?.users.length ?? 0) + 1;
  const AddMember = additionalParticipants.length + 1;
  const finalMember = nowMember + AddMember;

  const onRemoveNicknameClick = (index: number) => {
    // additionalParticipants배열을 복사하여 updatedParticipants에 저장
    // 직접 상태 수정하지 않고, 새 배열을 생성해 불변성을 유지하기 위해
    const updatedParticipants = [...additionalParticipants];
    /* splice method를 사용하여 updatedParticipants 배열에서 index에 해당하는 
      위치의 닉네임을 1개 제거 */
    updatedParticipants.splice(index, 1);
    setAdditionalParticipants(updatedParticipants);
  };

  const onAddNicknameClick = async () => {
    try {
      const response = await getApi({
        link: `/auth/check/nickname?nickname=${inputAddNickname}`,
      }); // 존재하는 닉네임인지 체크, 결과를 response에 저장

      const trimmedNickname = inputAddNickname.trim(); // 문자열 뒤 공백 제거

      // 추가된 닉네임 배열에 빈 문자열이 있는지 확인
      if (trimmedNickname === "") {
        return;
      }

      // response의 상태 코드가 409(중복)라면
      if (response.status !== 409) {
        showOneBtnDialog("존재하지 않는 닉네임이에요", ""); // 존재하지 않는 닉네임 추가하려 하면 오류 띄우기
      } else {
        // 미팅에 이미 참여 중인 모든 사용자의 닉네임 목록 생성
        const existingNicknames = parties?.acceptedParties.flatMap((party) =>
          party.users.map((user) => user.nickname)
        );
        const leaderNickname = parties?.leaderUserSummaryDto?.nickname;

        if (
          trimmedNickname === leaderNickname ||
          existingNicknames?.includes(trimmedNickname)
        ) {
          showOneBtnDialog(
            "닉네임을 확인해 주세요",
            "중복된 닉네임이나 빈칸이 있어요"
          );
          return;
        }

        // 이미 추가한 닉네임 중 중복된 닉네임이 없으면 추가
        if (additionalParticipants.includes(trimmedNickname)) {
          showOneBtnDialog(
            "닉네임을 확인해 주세요",
            "중복된 닉네임이나 빈칸이 있어요"
          ); // 이미 추가한 닉네임 추가하려 하면 오류 띄우기
          return;
        }

        if (finalMember >= (group?.maxUsers ?? 0)) {
          showOneBtnDialog("미팅 정원보다 많이 추가할 수 없어요");
          return;
        }

        // 닉네임이 myNickname과 같은지 확인
        if (trimmedNickname === profile?.nickname) {
          showOneBtnDialog("본인은 추가할 수 없어요"); // 본인 닉네임 추가 못하게 막기
          return;
        }

        // 그렇지 않다면 추가된 닉네임 배열 끝에 inputAddNickname 추가
        setAdditionalParticipants([...additionalParticipants, trimmedNickname]);
        setInputAddNickname(""); // 추가 후 입력 필드를 지움
      }

      inputRef.current?.focus();
    } catch (error) {
      console.error("비동기 작업 중 오류 발생!!!!", error);
      showOneBtnDialog("서버 오류가 발생했어요. 나중에 다시 시도해주세요");
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);

  const bodyData = {
    nicknames: [...additionalParticipants],
  };
  const headers = getHeaders(token);

  const onSubmitClick = () => {
    const PostUrl = `${import.meta.env.VITE_BASE_URL}/party/${id}`;

    fetch(PostUrl, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(bodyData),
      headers: headers,
    })
      .then((response) => {
        if (!response.ok) {
          console.error(
            `API 오류: ${response.status} - ${response.statusText}`
          );
          showOneBtnDialog("신청할 수 없어요", "이미 신청한 미팅방이에요");
          return response.json();
        }
        showOneBtnDialog("참여 신청 완료");
        return response.json();
      })
      .catch((error) => {
        console.error(error);
        showOneBtnDialog("서버 오류가 발생했어요. 나중에 다시 시도해주세요");
      });
  };

  // 외부 링크 이동 다이얼로그
  const [linkDialog, setLinkDialog] = useState<{
    open: boolean;
    url: string | null;
  }>({ open: false, url: null });
  const handleLinkClick = (url: string) => {
    setLinkDialog({ open: true, url });
  };

  const renderUserProfile = (user: IUser, isUserBlocked: boolean) => {
    return isUserBlocked ? (
      <div className="pb-3 text-[#d05438]">차단된 사용자입니다</div>
    ) : (
      <>
        <div className="gap-1">
          <span>{user?.nickname}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm whitespace-pre-wrap">
            <Linkify text={user?.description} onLinkClick={handleLinkClick} />
          </span>
          <MemberDetail>
            <span>{(user?.age ?? 0) + 1}살</span>
            <span>{user?.gender === "MALE" ? "남자" : "여자"}</span>
            <span>{user?.height}cm</span>
            <span>{user?.weight}kg</span>
          </MemberDetail>
        </div>
      </>
    );
  };

  if (isGroupLoading || isPartiesLoading) return <InLoading />;
  if (groupError || partiesError) return <div>데이터 로딩 중 오류 발생</div>;

  // token을 없앴을 때 문제 없이 로그인 화면으로 가지 않고 에러가 생김
  if (group == null || parties == null) {
    return null;
  }

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
              {group?.title}
            </span>
            <span className="text-sm font-normal text-gray-500">
              <Linkify
                text={group?.description}
                onLinkClick={handleLinkClick}
              />
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
                  <span className="font-medium">{formattedDate}</span>
                </DetailInfo>
                <DetailInfo>
                  <LocationIcon />
                  <span className="font-medium">{group?.meetPlace}</span>
                </DetailInfo>
                <DetailInfo>
                  <PersonIcon />
                  <span className="font-normal">
                    {`최대 인원 ${group?.maxUsers}명`}
                  </span>
                </DetailInfo>
              </div>
            </DetailInfoBox>
            <div className="w-full h-[1px] bg-[#EBE8E7]" />
            <DetailMember>
              <span className="text-sm font-normal text-gray-500 mb-1">
                참여자
              </span>
              <MemberInfo>
                {parties?.leaderUserSummaryDto && (
                  <>
                    <OrangeCrownIcon />
                    <div className="gap-1">
                      {renderUserProfile(
                        parties.leaderUserSummaryDto,
                        blockData?.blockedUserOutputs?.some(
                          (blockedUser: { nickname: string | undefined }) =>
                            blockedUser.nickname ===
                            parties.leaderUserSummaryDto?.nickname
                        )
                      )}
                    </div>
                  </>
                )}
              </MemberInfo>

              <MemberInfo>
                {parties?.acceptedParties?.map((party) => (
                  <div key={party.partyId}>
                    {party.users.map((user) => {
                      // 차단된 사용자인지 확인
                      const isBlocked = blockData?.blockedUserOutputs?.some(
                        (blockedUser: { nickname: string | undefined }) =>
                          blockedUser.nickname === user?.nickname
                      );
                      return (
                        <div key={user?.userId}>
                          {renderUserProfile(user, isBlocked)}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </MemberInfo>
            </DetailMember>
          </DetailContents>

          <JoinButtonBox>
            {decodedToken?.sub == group?.leaderUserSummaryDto?.userId ||
            group?.groupStatus == "CLOSE" ? (
              <LongWhiteBtn text="신청할 수 없어요" onClick={() => {}} />
            ) : (
              <LongOrangeBtn
                text="미팅 참여 신청"
                onClick={() => {
                  setShowAdd(true);
                }}
              />
            )}
          </JoinButtonBox>

          {showAdd && (
            <Overlay>
              <DialogContainer>
                <div className="flex-center w-full pl-3 pr-1 pb-4">
                  <MyInputBoxSVG
                    ref={inputRef}
                    onClick={() => {}}
                    label=" 닉네임으로 본인 외의 참여자 추가(선택 입력)"
                    value={inputAddNickname}
                    onChange={(e) => setInputAddNickname(e.target.value)}
                    placeholder="추가 참여자 닉네임(선택 입력)"
                    type="text"
                  />
                  <AddMemberButton onClick={onAddNicknameClick}>
                    <PlusIcon />
                  </AddMemberButton>
                </div>
                {showAdd && additionalParticipants.length > 0 && (
                  <AdditionalParticipantsList
                    participants={additionalParticipants}
                    onRemoveNicknameClick={onRemoveNicknameClick}
                  />
                )}
                <DialogBtnFrame>
                  <DialogLeftBtn
                    onClick={() => {
                      setShowAdd(false);
                    }}
                  >
                    <DialogLeftText>취소</DialogLeftText>
                  </DialogLeftBtn>
                  <DialogRightBtn onClick={onSubmitClick}>
                    <DialogRightText>신청하기</DialogRightText>
                  </DialogRightBtn>
                </DialogBtnFrame>
              </DialogContainer>
            </Overlay>
          )}
        </DetailBox>

        {oneBtnDialog.open && successDialog && (
          <Dialog
            isOneBtn
            title="참여 신청 완료"
            onRightClick={() => {
              setSuccessDialog(false);
              setShowAdd(false);
            }}
            right="닫기"
          />
        )}

        {oneBtnDialog.open && (
          <Dialog
            isOneBtn
            title={oneBtnDialog.title}
            contents={oneBtnDialog.contents}
            onRightClick={hideOneBtnDialog}
            right={"닫기"}
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
              }
            }}
          />
        )}
      </DetailScreen>
    </>
  );
}

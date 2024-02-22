import {
  DialogContainer,
  DialogOneBtn,
  LongOrangeBtn,
  LongWhiteBtn,
} from "../../components/styles/Button";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import { getApi } from "../../api/getApi";
import {
  ArrowbackIcon,
  DateIcon,
  LocationIcon,
  OrangeCrownIcon,
  PersonIcon,
  XIcon,
} from "../../components/styles/Icons";
import { TopBar } from "../../components/TopBar";
import { useLoginGuard } from "../../hooks/useLoginGuard";
import { IGroup } from "../../model/group";
import { IParties } from "../../model/party";
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
  AddMemberWrapper,
} from "../components/meetingDetail.Components";
import { useNavigate, useParams } from "react-router-dom";
import { Overlay, SheetXIcon } from "../../sign-up/styles/detailComponents";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { formatDate } from "../../utils";
import { getHeaders } from "../../components/getHeaders";
import {
  AddMemberButton,
  AddMemberText,
} from "../../create-meeting/styles/createMeetingDetailComponents";
import { MyInputBoxSVG } from "../../components/MyInputBox";
import AdditionalParticipantsList from "../../create-meeting/components/additionalParticipantsList";

export default function MeetingDetail() {
  useLoginGuard();
  const navigate = useNavigate();
  const { id } = useParams();

  const [token, setToken] = useState(""); // 토큰 상태 추가
  const [decodedToken, setDecodedToken] = useState<JwtPayload | null>(null);
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setDecodedToken(jwtDecode(storedToken + ""));
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const [showDialog, setShowDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

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

  const getUserProfile = async () => {
    const response = await getApi({ link: `/users/profile/my` });
    const data = await response.json();
    return data;
  };
  const { data: profile } = useQuery(["profile"], getUserProfile);

  const meetingDate = group?.meetDate ? new Date(group?.meetDate) : null;
  const formattedDate = meetingDate ? formatDate(group?.meetDate) : "";

  useEffect(() => {
    console.log("AcceptedParties", parties);
    console.log(profile);
    console.log("그룹", group);
  }, []);

  // 닉네임으로 참여자 추가(선택 입력)
  const [additionalParticipants, setAdditionalParticipants] = useState<
    string[]
  >([]);
  const [inputAddNickname, setInputAddNickname] = useState("");
  const [nonExistentDialog, setNonExistentDialog] = useState(false);
  const [addMyNicknameDialog, setAddMyNicknameDialog] = useState(false);
  const [duplicateOrBlankErrorDialog, setDuplicateOrBlankErrorDialog] =
    useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [cantAddDialog, setCantAddDialog] = useState(false);

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

      // trim()으로 문자열 뒤 공백 제거
      const trimmedNickname = inputAddNickname.trim();

      // 추가된 닉네임 배열에 빈 문자열이 있는지 확인
      if (trimmedNickname === "") {
        return;
      }

      // response의 상태 코드가 409(중복)라면
      if (response.status !== 409) {
        setNonExistentDialog(true); // 존재하지 않는 닉네임 추가하려 하면 오류 띄우기
      } else {
        // 이미 추가한 닉네임 중 중복된 닉네임이 없으면 추가
        if (additionalParticipants.includes(trimmedNickname)) {
          setDuplicateOrBlankErrorDialog(true); // 이미 추가한 닉네임 추가하려 하면 오류 띄우기
          return;
        }

        if (finalMember >= (group?.maxUsers ?? 0)) {
          setCantAddDialog(true);
          return;
        }

        // 닉네임이 myNickname과 같은지 확인
        if (trimmedNickname === profile?.nickname) {
          setAddMyNicknameDialog(true); // 본인 닉네임 추가 못하게 막기
          return;
        }

        // 그렇지 않다면 추가된 닉네임 배열 끝에 inputAddNickname 추가
        setAdditionalParticipants([...additionalParticipants, trimmedNickname]);
        setInputAddNickname(""); // 추가 후 입력 필드를 지움
      }
    } catch (error) {
      console.error("비동기 작업 중 오류 발생!!!!", error);
    }
  };

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
          setShowErrorDialog(true);
          return response.json();
        }
        setShowDialog(true);
        return response.json();
      })
      .catch((error) => {
        console.error(error);
      });
  };

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
              {group?.description}
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
              <span className="text-sm font-normal text-gray-500 mb-4">
                참여자
              </span>
              <MemberInfo>
                {parties?.leaderUserSummaryDto && (
                  <>
                    <div className="flex items-center gap-1">
                      {parties?.leaderUserSummaryDto?.nickname}
                      <OrangeCrownIcon />
                    </div>
                    <span className="whitespace-pre-wrap text-sm">
                      {parties?.leaderUserSummaryDto?.description}
                    </span>
                    <MemberDetail>
                      <span>{parties?.leaderUserSummaryDto?.age}살</span>
                      <span>
                        {parties?.leaderUserSummaryDto?.gender === "MALE"
                          ? "남자"
                          : "여자"}
                      </span>
                      <span>{parties?.leaderUserSummaryDto?.height}cm</span>
                      <span>{parties?.leaderUserSummaryDto?.weight}kg</span>
                    </MemberDetail>
                  </>
                )}
              </MemberInfo>

              <MemberInfo>
                {parties?.acceptedParties?.map((party) => (
                  <div key={party.partyId}>
                    {party.users.map((user) => (
                      <div key={user?.userId}>
                        <div className="flex gap-1 items-center">
                          <span>{user?.nickname}</span>
                        </div>
                        <span className="text-sm whitespace-pre-wrap">
                          {user?.description}
                        </span>
                        <MemberDetail>
                          <span>{user?.age}살</span>
                          <span>
                            {user?.gender === "MALE" ? "남자" : "여자"}
                          </span>
                          <span>{user?.height}cm</span>
                          <span>{user?.weight}kg</span>
                        </MemberDetail>
                      </div>
                    ))}
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
                <AddMemberWrapper>
                  <div className="flex flex-row-reverse gap-2 items-center">
                    <SheetXIcon
                      onClick={() => {
                        setShowAdd(false);
                      }}
                    >
                      <XIcon />
                    </SheetXIcon>

                    <AddMemberText>
                      닉네임으로 본인 외의 참여자 추가(선택 입력)
                    </AddMemberText>
                  </div>
                  <div className="flex items-center">
                    <MyInputBoxSVG
                      onClick={() => {}}
                      label=""
                      value={inputAddNickname}
                      onChange={(e) => setInputAddNickname(e.target.value)}
                      placeholder="추가 참여자 닉네임(선택 입력)"
                      type="text"
                    />
                    <AddMemberButton onClick={onAddNicknameClick}>
                      +
                    </AddMemberButton>
                  </div>
                  {showAdd && additionalParticipants.length > 0 ? (
                    <AdditionalParticipantsList
                      participants={additionalParticipants}
                      onRemoveNicknameClick={onRemoveNicknameClick}
                    />
                  ) : null}
                </AddMemberWrapper>

                <LongOrangeBtn text="신청하기" onClick={onSubmitClick} />
              </DialogContainer>
            </Overlay>
          )}
        </DetailBox>

        {showDialog && (
          <Overlay>
            <DialogOneBtn
              title="참여 신청 완료"
              contents=""
              right="닫기"
              onRightClick={() => {
                setShowDialog(false);
                setShowAdd(false);
              }}
            />
          </Overlay>
        )}
        {showErrorDialog && (
          <Overlay>
            <DialogOneBtn
              title="신청할 수 없어요"
              contents="이미 신청한 미팅방일 수 있어요"
              right="닫기"
              onRightClick={() => {
                setShowErrorDialog(false);
              }}
            />
          </Overlay>
        )}

        {cantAddDialog && (
          <Overlay>
            <DialogOneBtn
              title="미팅 정원보다 많이 추가할 수 없어요."
              contents=""
              onRightClick={() => {
                setCantAddDialog(false);
              }}
              right="닫기"
            />
          </Overlay>
        )}

        {duplicateOrBlankErrorDialog && (
          <Overlay>
            <DialogOneBtn
              title="닉네임을 확인해 주세요."
              contents="중복된 닉네임이나 빈칸이 있어요."
              onRightClick={() => {
                setDuplicateOrBlankErrorDialog(false);
              }}
              right="닫기"
            />
          </Overlay>
        )}

        {addMyNicknameDialog && (
          <Overlay>
            <DialogOneBtn
              title="본인은 추가할 수 없어요."
              contents=""
              onRightClick={() => {
                setAddMyNicknameDialog(false);
              }}
              right="닫기"
            />
          </Overlay>
        )}

        {nonExistentDialog && (
          <Overlay>
            <DialogOneBtn
              title="존재하지 않는 닉네임이에요."
              contents=""
              onRightClick={() => {
                setNonExistentDialog(false);
              }}
              right="닫기"
            />
          </Overlay>
        )}
      </DetailScreen>
    </>
  );
}

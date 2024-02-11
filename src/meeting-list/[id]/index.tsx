import {
  DialogOneBtn,
  LongOrangeBtn,
  LongWhiteBtn,
} from "../../components/Button";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import { getApi } from "../../api/getApi";
import {
  ArrowbackIcon,
  DateIcon,
  LocationIcon,
  OrangeCrownIcon,
  PersonIcon,
} from "../../components/Icons";
import { TopBar } from "../../components/TopBar";
import { useLoginGuard } from "../../hooks/useLoginGuard";
import { IGroup } from "../../model/group";
import { IParties } from "../../model/party";
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
import { Overlay } from "../../sign-up/components/detailComponents";
import { JwtPayload, jwtDecode } from "jwt-decode";

export default function MeetingDetail() {
  useLoginGuard();
  const navigate = useNavigate();
  const { id } = useParams();
  const [date, setDate] = useState("");

  const [token, setToken] = useState(""); // 토큰 상태 추가
  const [decodedToken, setDecodedToken] = useState<JwtPayload | null>(null);
  useEffect(() => {
    // 컴포넌트가 마운트될 때 localStorage에서 토큰을 가져와 상태에 설정
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

  useEffect(() => {
    if (group) {
      setDate(getDate(group.meetDate));
    }
  }, [group]);

  useEffect(() => {
    console.log("AcceptedParties", parties);
    console.log(profile);
    console.log("그룹", group);
  }, []);

  const bodyData = {
    nicknames: [],
  };
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`, // 토큰을 헤더에 추가
  };

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
                    {`최대 인원 ${group.maxUsers}명`}
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
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 4 }}
                    >
                      {parties?.leaderUserSummaryDto?.userName}
                      <OrangeCrownIcon />
                    </div>
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
                      <div key={user.userId}>
                        <div className="flex gap-1 items-center">
                          <span>{user.userName}</span>
                        </div>
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
              <LongOrangeBtn text="미팅 참여 신청" onClick={onSubmitClick} />
            )}
          </JoinButtonBox>
        </DetailBox>

        {showDialog && (
          <Overlay style={{ zIndex: "30" }}>
            <DialogOneBtn
              title="참여 신청 완료"
              contents=""
              right="닫기"
              onRightClick={() => {
                setShowDialog(false);
              }}
            />
          </Overlay>
        )}
        {showErrorDialog && (
          <Overlay style={{ zIndex: "30" }}>
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
      </DetailScreen>
    </>
  );
}

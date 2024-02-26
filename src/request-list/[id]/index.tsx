import { getApi } from "../../api/getApi";
import { useNavigate, useParams } from "react-router-dom";
import { TopBar } from "../../components/TopBar";
import { ArrowbackIcon } from "../../components/styles/Icons";
import {
  DialogOneBtn,
  SmallOrangeBtn,
  SmallWhiteBtn,
} from "../../components/styles/Button";
import { useState } from "react";
import { Overlay } from "../../sign-up/styles/detailComponents";
import {
  RequestBox,
  UserInfo,
  UserName,
  UserDetail,
  UserDescription,
} from "../components/requestListComponents";
import { PaddingScreen } from "../../components/styles/Screen";
import { GrayLine } from "../../meeting-chat-room/styles/SideMenuComponents";
import useGetParties from "../../api/useGetParties";

interface DialogStates {
  [key: string]: boolean;
}

export default function RequestProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: parties,
    isLoading: isPartiesLoading,
    error: partiesError,
  } = useGetParties(id);

  // 각 파티별로 수락/거절 상태를 관리하는 객체
  const [dialogStates, setDialogStates] = useState<DialogStates>({});

  // 수락/거절 상태 설정 함수
  const setDialogState = (
    partyId: string | number,
    type: "accept" | "reject",
    value: boolean
  ) => {
    setDialogStates((prev) => ({ ...prev, [`${partyId}-${type}`]: value }));
  };

  // 수락 클릭 핸들러
  const onAcceptClick = (partyId: number | string) => {
    getApi({ link: `/groups/${id}/parties/${partyId}/accept` }).then(() => {
      setDialogState(partyId, "accept", true);
    });
  };

  // 거절 클릭 핸들러
  const onRejectClick = (partyId: number | string) => {
    getApi({ link: `/groups/${id}/parties/${partyId}/reject` }).then(() => {
      setDialogState(partyId, "reject", true);
    });
  };

  if (isPartiesLoading) {
    return <div>로딩중이에요...</div>;
  }

  if (partiesError) {
    return (
      <div>
        데이터를 불러오는 중 오류가 발생했어요. 나중에 다시 시도해 주세요.
      </div>
    );
  }

  return (
    <>
      <TopBar
        title="참여 요청 목록"
        leftIcon={<ArrowbackIcon onClick={() => navigate(-1)} />}
      />
      <PaddingScreen>
        {parties?.waitingParties?.map((party) => (
          <RequestBox key={party.partyId}>
            <GrayLine />
            {party.users.map((user, index) => (
              <UserInfo key={index}>
                <div>
                  <UserName>{user?.nickname}</UserName>
                  <UserDescription>{user?.description}</UserDescription>
                  <UserDetail>
                    <span>{user?.age}살</span>
                    <span>{user?.gender === "MALE" ? "남자" : "여자"}</span>
                    <span>{user?.height}cm</span>
                    <span>{user?.weight}kg</span>
                  </UserDetail>
                </div>

                {/* Dialog 조건부 렌더링 */}
                {dialogStates[`${party.partyId}-accept`] && (
                  <Overlay>
                    <DialogOneBtn
                      title={`${user.nickname}님의 그룹을 수락했어요.`}
                      contents=""
                      onRightClick={() => {
                        setDialogState(party.partyId, "accept", false);
                        navigate(-1);
                      }}
                      right="닫기"
                    />
                  </Overlay>
                )}
                {dialogStates[`${party.partyId}-reject`] && (
                  <Overlay>
                    <DialogOneBtn
                      title={`${user.nickname}님의 그룹을 거절했어요.`}
                      contents=""
                      onRightClick={() => {
                        setDialogState(party.partyId, "reject", false);
                        navigate(-1);
                      }}
                      right="닫기"
                    />
                  </Overlay>
                )}
              </UserInfo>
            ))}
            <div className="flex gap-2">
              <SmallWhiteBtn
                text="거절"
                onClick={() => {
                  onRejectClick(party.partyId);
                }}
              />
              <SmallOrangeBtn
                text="수락"
                onClick={() => {
                  onAcceptClick(party.partyId);
                }}
              />
            </div>
          </RequestBox>
        ))}
      </PaddingScreen>
    </>
  );
}

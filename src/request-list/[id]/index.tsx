import { getApi } from "../../api/getApi";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { TopBar } from "../../components/TopBar";
import { ArrowbackIcon } from "../../components/Icons";
import {
  DialogOneBtn,
  SmallOrangeBtn,
  SmallWhiteBtn,
} from "../../components/Button";
import { useState } from "react";
import { Overlay } from "../../sign-up/components/detailComponents";
import {
  RequestListScreen,
  RequestBox,
  UserInfo,
  UserName,
  UserDetail,
} from "../components/requestListComponents";

export default function RequestProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const getParties = () =>
    getApi({ link: `/groups/${id}/parties` }).then((response) =>
      response.json()
    );
  const { data: parties } = useQuery(["parties", id], getParties, {
    enabled: !!id,
  });

  const getAccept = (partyId: string) =>
    getApi({ link: `/groups/${id}/parties/${partyId}/accept` }).then(
      (response) => response.json()
    );

  const getReject = (partyId: string) =>
    getApi({ link: `/groups/${id}/parties/${partyId}/reject` }).then(
      (response) => response.json()
    );

  const [acceptDialog, setAcceptDialog] = useState(false);
  const [rejectDialog, setRejectDialog] = useState(false);

  // 수락 클릭
  const onAcceptClick = (partyId: string) => {
    getAccept(partyId);
    setAcceptDialog(true);
  };
  // 거절 클릭
  const onRejectClick = (partyId: string) => {
    getReject(partyId);
    setRejectDialog(true);
  };
  return (
    <>
      <TopBar
        title="참여 요청 목록"
        leftIcon={<ArrowbackIcon onClick={() => navigate(-1)} />}
      />
      <RequestListScreen>
        {parties?.waitingParties?.map((party, index: number) => (
          <RequestBox key={index}>
            {party?.users?.map((user, userIndex: number) => (
              <UserInfo key={userIndex}>
                <div>
                  <UserName>{user.userName}</UserName>
                  <UserDetail>
                    <span>{user?.age}살</span>
                    <span>{user?.gender === "MALE" ? "남자" : "여자"}</span>
                    <span>{user?.height}cm</span>
                    <span>{user?.weight}kg</span>
                  </UserDetail>
                </div>
                {/* */}
                <div style={{ display: "flex", gap: 8 }}>
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
                {acceptDialog && (
                  <Overlay style={{ zIndex: "30" }}>
                    <DialogOneBtn
                      title={`${user.userName}님을 수락했어요.`}
                      contents=""
                      onRightClick={() => {
                        setAcceptDialog(false);
                        navigate(`/meeting-chat-room/${id}`);
                      }}
                      right="닫기"
                    />
                  </Overlay>
                )}

                {rejectDialog && (
                  <Overlay style={{ zIndex: "30" }}>
                    <DialogOneBtn
                      title={`${user.userName}님을 거절했어요.`}
                      contents=""
                      onRightClick={() => {
                        setRejectDialog(false);
                        navigate(`/meeting-chat-room/${id}`);
                      }}
                      right="닫기"
                    />
                  </Overlay>
                )}
              </UserInfo>
            ))}
          </RequestBox>
        ))}
      </RequestListScreen>
    </>
  );
}

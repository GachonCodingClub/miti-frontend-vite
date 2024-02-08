import { getApi } from "../../api/getApi";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { TopBar } from "../../components/TopBar";
import { Screen } from "../../components/Screen";
import { ArrowbackIcon } from "../../components/Icons";
import styled from "styled-components";
import { SmallOrangeBtn, SmallWhiteBtn } from "../../components/Button";

export const RequestListScreen = styled(Screen)`
  padding: 0;
  padding-top: 56px;
  padding-bottom: 64px;
`;

export const RequestBox = styled.div`
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-color: #f2f0ef;
`;

export const UserInfo = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;

export const UserName = styled.div`
  font-weight: 500;
  line-height: 20px;
  letter-spacing: -2%;
`;

export const UserDetail = styled.div`
  display: flex;
  gap: 8px;
  span {
    font-weight: 400;
    font-size: 14px;
    letter-spacing: -1.6%;
    color: #767170;
  }
`;

export default function ViewProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const getParties = () =>
    getApi({ link: `/groups/${id}/parties` }).then((response) =>
      response.json()
    );
  const { data: parties } = useQuery(["parties", id], getParties, {
    enabled: !!id,
  });
  return (
    <>
      <TopBar
        title="참여 요청 목록"
        leftIcon={<ArrowbackIcon onClick={() => navigate(-1)} />}
      />
      <RequestListScreen>
        {parties?.waitingParties?.map((party, index) => (
          <RequestBox key={index}>
            {party?.users?.map((user, userIndex) => (
              <UserInfo key={userIndex}>
                <div>
                  <UserName>{user.userName}</UserName>
                  <UserDetail>
                    <span>{user.age}살</span>
                    <span>{user.gender === "MALE" ? "남자" : "여자"}</span>
                    <span>{user.height}cm</span>
                    <span>{user.weight}kg</span>
                  </UserDetail>
                </div>
                {/* */}
                <div style={{ display: "flex", gap: 8 }}>
                  <SmallWhiteBtn
                    text="거절"
                    onClick={() => {
                      console.log("거절");
                    }}
                  />
                  <SmallOrangeBtn
                    text="수락"
                    onClick={() => {
                      console.log("수락");
                    }}
                  />
                </div>
              </UserInfo>
            ))}
          </RequestBox>
        ))}
      </RequestListScreen>
    </>
  );
}

import styled from "styled-components";
import { Screen } from "../components/Screen";
import { TopBar } from "../components/TopBar";
import { Link } from "react-router-dom";

const RequestListScreen = styled(Screen)`
  padding: 0;
  padding-top: 56px;
`;

const RequestBox = styled.div`
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-color: #f2f0ef;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const UserName = styled.div`
  font-weight: 500;
  line-height: 20px;
  letter-spacing: -2%;
`;

const UserDetail = styled.div`
  display: flex;
  gap: 8px;
  span {
    font-weight: 400;
    font-size: 14px;
    letter-spacing: -1.6%;
    color: #767170;
  }
`;

const ViewProfile = styled(Link)`
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: -1%;
  color: #767170;
`;

export default function RequestList() {
  const dummyList = [
    {
      userId: "1",
      userName: "신청자1",
      gender: "MALE",
      height: "A",
      weight: "A",
      age: 20,
    },
    {
      userId: "2",
      userName: "신청자2",
      gender: "FEMALE",
      height: "B",
      weight: "B",
      age: 21,
    },
  ];

  return (
    <>
      <TopBar title="참여 요청 목록" />
      <RequestListScreen className="divide-y">
        {dummyList.map((user) => (
          <RequestBox key={user.userId}>
            <UserInfo>
              <UserName>{user.userName}</UserName>
              <UserDetail>
                <span>{user.age}살</span>
                <span>{user.gender === "MALE" ? "남자" : "여자"}</span>
                <span>{user.height}cm</span>
                <span>{user.weight}kg</span>
              </UserDetail>
            </UserInfo>
            <ViewProfile to={`/request-list/${user.userId}`}>
              프로필 보기
            </ViewProfile>
          </RequestBox>
        ))}
      </RequestListScreen>
    </>
  );
}

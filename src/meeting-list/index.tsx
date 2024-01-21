import { TabBar } from "../components/TabBar";
import { useQuery } from "react-query";
import { getApi } from "../api/getApi";
import { MeetingScreen } from "./components/meetingListComponents";
import { useLoginGuard } from "../hooks/useLoginGuard";
import MeetingBoxComponent from "../components/MeetingBoxComponent";
import { useRecoilState, useRecoilValue } from "recoil";
import { SnackBar } from "../components/Button";
import { ROUTES } from "../routes";
import { TopBar } from "../components/TopBar";
import { userEmailAtom, userNicknameAtom, SnackBarAtom } from "../atoms";
import { IGroups } from "../model/group";
import { useNavigate } from "react-router-dom";

export default function MeetingList() {
  // 유저 정보
  const userEmailState = useRecoilState(userEmailAtom);
  const userEmail = userEmailState[0];
  const userNicknameState = useRecoilState(userNicknameAtom);
  const userNickname = userNicknameState[0];
  console.log("유저 이메일 : ", userEmail, "유저 닉네임 : ", userNickname);
  useLoginGuard();
  const getGroups = () =>
    getApi({ link: "/groups" }).then(
      (response) => response.json() as Promise<IGroups>
    );
  const { data, isLoading } = useQuery(["groups"], getGroups);
  const groups = data?.content;
  const isRoomDeleted = useRecoilValue(SnackBarAtom);

  const navigate = useNavigate(); // useNavigate 사용
  return (
    !isLoading && (
      <>
        <TopBar title="모집중인 미팅" />
        <MeetingScreen>
          <div className="divide-y-[1px]">
            {groups?.map((meeting, index) => (
              <MeetingBoxComponent meeting={meeting} key={index} />
            ))}
          </div>
          {/* 미팅 삭제하기를 통해 미팅리스트로 이동했을 경우 */}
          {isRoomDeleted && (
            <SnackBar text="미팅을 삭제했어요." onClick={() => {}}></SnackBar>
          )}
          <button
            onClick={() => {
              navigate(`${ROUTES.CREATE_MEETING}`);
            }}
          >
            이동
          </button>
          <button
            onClick={() => {
              navigate("/meeting-chat-room/209");
            }}
            style={{ background: "tomato" }}
          >
            채팅방으로 이동{" "}
          </button>

          <TabBar />
        </MeetingScreen>
      </>
    )
  );
}

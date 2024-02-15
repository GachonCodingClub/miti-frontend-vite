import { TabBar } from "../components/TabBar";
import { getApi } from "../api/getApi";
import { CreateMeetingButton } from "./components/meetingListComponents";
import { useLoginGuard } from "../hooks/useLoginGuard";
import MeetingBoxComponent from "../components/MeetingBoxComponent";
import { useRecoilValue } from "recoil";
import { SnackBar } from "../components/styles/Button";
import { ROUTES } from "../routes";
import { TopBar } from "../components/TopBar";
import { SnackBarAtom } from "../atoms";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { IGroup } from "../model/group";
import { PaddingScreen } from "../components/styles/Screen";
import { SearchIcon } from "../components/styles/Icons";

export default function MeetingList() {
  useLoginGuard();
  const isRoomDeleted = useRecoilValue(SnackBarAtom);
  const navigate = useNavigate(); // useNavigate 사용
  // 무한스크롤 도전
  const [meetings, setMeetings] = useState<IGroup[]>([]);
  const sortedMeetings = meetings.sort((a, b) => a.id - b.id);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchMeetings = async (page: number) => {
    try {
      setLoading(true);
      console.log("미팅리스트:", meetings);
      const res = await getApi({ link: `/groups?page=${page}` });
      const data = await res.json();
      setMeetings((prev) => [...prev, ...data.content]);
    } catch (error) {
      console.error("Error fetching meetings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings(page);
  }, [page]);

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };
  // 페이지 엔드 리퍼런스를 useRef(null)로 초기화
  const pageEnd = useRef(null);

  useEffect(() => {
    if (loading && pageEnd.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            loadMore();
          }
        },
        { threshold: 1 }
      );
      observer.observe(pageEnd.current);
    }
  }, [loading, pageEnd.current]);
  return (
    <>
      <TopBar
        title="모집중인 미팅"
        rightIcon={<SearchIcon />}
        onRightIconClick={() => {
          navigate(`/search`);
        }}
      />
      <PaddingScreen>
        <CreateMeetingButton
          onClick={() => {
            navigate(`${ROUTES.CREATE_MEETING}`);
          }}
        >
          +
        </CreateMeetingButton>
        <div className="divide-y-[1px]">
          {sortedMeetings?.map((meeting, index) => (
            <MeetingBoxComponent meeting={meeting} key={index} />
          ))}
        </div>
        <div ref={pageEnd} />
        {loading && <div>로딩중...</div>}

        {/* 미팅 삭제하기를 통해 미팅리스트로 이동했을 경우 */}
        {isRoomDeleted && (
          <SnackBar text="미팅을 나왔어요." onClick={() => {}} />
        )}
        <TabBar />
      </PaddingScreen>
    </>
  );
}

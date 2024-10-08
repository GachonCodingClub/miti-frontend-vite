import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getApi } from "../api/getApi";
import MeetingBoxComponent from "../components/MeetingBoxComponent";
import { IGroup } from "../model/group";
import { PaddingScreen } from "../components/styles/Screen";
import { TopBar } from "../components/TopBar";
import { ArrowbackIcon, SearchIcon } from "../components/styles/Icons";
import { ROUTES } from "../routes";
import { SearchBox, SearchInput } from "./styles/searchStyles";
import { useLocalStorageSearch } from "./components/useLocalStorageSearch";
import { Keyboard } from "@capacitor/keyboard";
import { InLoading } from "../components/InLoading";

const SEARCH_TERM_KEY = "searchTerm";
const SEARCH_RESULTS_KEY = "searchResults";

export default function SearchPage() {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState<IGroup[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<IGroup[]>([]);
  const [loading, setLoading] = useState(false);

  useLocalStorageSearch(
    searchTerm,
    setSearchTerm,
    searchResults,
    setSearchResults,
    SEARCH_TERM_KEY,
    SEARCH_RESULTS_KEY
  );

  const fetchMeetings = async () => {
    setLoading(true); // 데이터를 가져오기 전 로딩 상태
    try {
      const res = await getApi({ link: `/groups?size=100` });
      const data = await res.json();
      setMeetings(data?.content || []);
      setLoading(false); // 데이터를 가져온 후 로딩 상태
    } catch (error) {
      console.error("미팅 가져오는데 에러 발생", error);
      alert("서버 오류가 발생했어요. 나중에 다시 시도해주세요");
      setLoading(true);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const onSearchButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const filteredSearchTerm = searchTerm.toLowerCase().trim();
    if (filteredSearchTerm === "") {
      setSearchResults([]); // 공백 검색 시, 결과 리스트 비워둠
      return;
    }

    // 검색어에 해당하는 미팅 필터링
    const results = meetings.filter(
      (meeting) =>
        meeting.title.toLowerCase().includes(filteredSearchTerm) ||
        meeting.meetPlace.toLowerCase().includes(filteredSearchTerm)
    );
    setSearchResults(results);
  };

  const onBackClick = () => {
    localStorage.removeItem(SEARCH_TERM_KEY);
    localStorage.removeItem(SEARCH_RESULTS_KEY);
    navigate(`${ROUTES.MEETING_LIST}`);
  };

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    // iOS에서만 키보드 높이를 감지하고 상태를 업데이트
    const showListener = Keyboard.addListener("keyboardWillShow", (info) => {
      setKeyboardHeight(info.keyboardHeight);
    });

    const hideListener = Keyboard.addListener("keyboardWillHide", () => {
      setKeyboardHeight(0);
    });

    return () => {
      // 리스너 제거
      showListener?.remove();
      hideListener?.remove();
    };
  }, []);

  const chattingInputDivStyle = {
    paddingBottom: keyboardHeight + "px",
  };

  return (
    <>
      <TopBar title="검색" leftIcon={<ArrowbackIcon onClick={onBackClick} />} />
      <PaddingScreen>
        {loading ? (
          <InLoading />
        ) : (
          <form>
            <SearchBox>
              <SearchInput
                type="text"
                placeholder="미팅 제목 또는 미팅 장소 검색"
                value={searchTerm}
                onChange={handleSearchTermChange}
              />
              <button onClick={onSearchButtonClick}>{<SearchIcon />}</button>
            </SearchBox>
          </form>
        )}

        <ul className="divide-y-[1px] pt-14" style={chattingInputDivStyle}>
          {searchResults.map((meeting, index) => (
            <MeetingBoxComponent
              onClick={() => {
                navigate(`/meeting-list/${meeting?.id}`);
              }}
              meeting={meeting}
              key={index}
            />
          ))}
        </ul>
      </PaddingScreen>
    </>
  );
}

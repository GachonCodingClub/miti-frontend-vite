import "./styles/globals.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RecoilRoot } from "recoil";
import SignUp from "./sign-up";
import LogIn from "./sign-in";
import SignUpAgreement from "./sign-up/agreement";
import PasswordSetting from "./sign-up/password";
import SingUpDetail from "./sign-up/detail";
import MeetingList from "./meeting-list";
import Profile from "./profile";
import EditProfile from "./profile/setting/edit";
import Setting from "./profile/setting";
import CreateMeeting from "./create-meeting";
import CreateMeetingDetail from "./create-meeting/detail";
import MeetingDetail from "./meeting-list/[id]";
import MeetingChatRoom from "./meeting-chat-room/[id]";
import EditMeeting from "./edit-meeting/[id]";
import EditMeetingDetail from "./edit-meeting/[id]/detail";
import RequestProfile from "./request-list/[id]";
import ChattingList from "./chatting-list";
import Withdrawal from "./profile/setting/withdrawal";
import ChangePassword from "./sign-in/change-password";
import MITI from ".";
import SearchPage from "./search";
import { CustomTabBar } from "./components/CustomTabBar";
import Report from "./report";
import Agreement from "./profile/setting/agreement";
import Notice from "./profile/setting/notice";
import BackButtonHandler from "./BackButtonHandler";
import GlobalAlert from "./components/GlobalAlert";
import { Capacitor } from "@capacitor/core";
import { useEffect, useState } from "react";
import PersonlaInfo from "./PersonalInfo";
import { ROUTES } from "./routes";
import BlockList from "./block/blockList";

const queryClient = new QueryClient();

const App = () => {
  const [statusBar, setStatusBar] = useState(false);
  useEffect(() => {
    if (Capacitor.getPlatform() === "ios") {
      setStatusBar(true);
    }
  }, []);

  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <div className="w-full max-w-xl mx-auto">
          <BrowserRouter>
            <BackButtonHandler />
            {statusBar && (
              <div className="bg-black top-0 fixed h-12 z-50 w-full" />
            )}
            <Routes>
              {/* 기본 미티 화면 */}
              <Route path="/" element={<MITI />} />
              {/* 로그인/회원가입 */}
              <Route path={`${ROUTES.SIGN_IN}`} element={<LogIn />} />
              <Route
                path={`${ROUTES.CHANGE_PASSWORD}`}
                element={<ChangePassword />}
              />
              <Route
                path={`${ROUTES.AGREEMENTS}`}
                element={<SignUpAgreement />}
              />
              <Route path={`${ROUTES.SIGN_UP}`} element={<SignUp />} />
              <Route
                path={`${ROUTES.PASSWORD}`}
                element={<PasswordSetting />}
              />
              <Route path={`${ROUTES.DETAIL}`} element={<SingUpDetail />} />
              {/* 미팅리스트 */}
              <Route
                path={`${ROUTES.MEETING_LIST}`}
                element={<MeetingList />}
              />
              <Route
                path={`${ROUTES.MEETING_LIST_ID}`}
                element={<MeetingDetail />}
              />
              <Route path={`${ROUTES.SEARCH}`} element={<SearchPage />} />
              {/* 채팅리스트 */}
              <Route path={`${ROUTES.CHAT_LIST}`} element={<ChattingList />} />
              {/* 프로필 */}
              <Route path={`${ROUTES.PROFILE}`} element={<Profile />} />
              <Route path={`${ROUTES.PORFILE_SETTING}`} element={<Setting />} />
              <Route
                path={`${ROUTES.SETTING_EDIT}`}
                element={<EditProfile />}
              />
              <Route
                path={`${ROUTES.SETTING_WITHDRAWAL}`}
                element={<Withdrawal />}
              />
              <Route path={`${ROUTES.AGREEMENT}`} element={<Agreement />} />
              <Route path={`${ROUTES.NOTICE}`} element={<Notice />} />
              <Route path={`${ROUTES.BLOCKLIST}`} element={<BlockList />} />
              <Route path={`${ROUTES.REPORT}`} element={<Report />} />
              {/* 미팅 만들기 */}
              <Route
                path={`${ROUTES.CREATE_MEETING}`}
                element={<CreateMeeting />}
              />
              <Route
                path={`${ROUTES.CREATE_MEETING_DETAIL}`}
                element={<CreateMeetingDetail />}
              />
              {/* 채팅방 */}
              <Route
                path={`${ROUTES.MEETING_CHAT_ROOM_ID}`}
                element={<MeetingChatRoom />}
              />
              {/* 미팅 수정하기 */}
              <Route
                path={`${ROUTES.EDIT_MEETING_ID}`}
                element={<EditMeeting />}
              />
              <Route
                path={`${ROUTES.EDIT_MEETING_ID_DETAIL}`}
                element={<EditMeetingDetail />}
              />
              {/* 참여 요청 목록 */}
              <Route
                path={`${ROUTES.REQUEST_LIST_ID}`}
                element={<RequestProfile />}
              />

              {/* 개인정보 처리 방침 */}
              <Route
                path={`${ROUTES.PERSONAL_INFO}`}
                element={<PersonlaInfo />}
              />
            </Routes>
            <CustomTabBar />
            <GlobalAlert />
          </BrowserRouter>
        </div>
      </QueryClientProvider>
    </RecoilRoot>
  );
};

export default App;

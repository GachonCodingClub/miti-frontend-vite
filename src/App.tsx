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

const queryClient = new QueryClient();

const App = () => {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <div className="w-full max-w-xl mx-auto">
          <BrowserRouter>
            <Routes>
              {/* 기본 미티 화면 */}
              <Route path="/" element={<MITI />} />
              {/* 로그인/회원가입 */}
              <Route path="/sign-in" element={<LogIn />} />
              <Route
                path="/sign-in/change-password"
                element={<ChangePassword />}
              />
              <Route path="/sign-up/agreement" element={<SignUpAgreement />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/sign-up/password" element={<PasswordSetting />} />
              <Route path="/sign-up/detail" element={<SingUpDetail />} />
              {/* 미팅리스트 */}
              <Route path="/meeting-list" element={<MeetingList />} />
              <Route path="/meeting-list/:id" element={<MeetingDetail />} />
              {/* 채팅리스트 */}
              <Route path="/chat-list" element={<ChattingList />} />
              {/* 프로필 */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/setting" element={<Setting />} />
              <Route path="/setting/edit" element={<EditProfile />} />
              <Route path="/setting/withdrawal" element={<Withdrawal />} />
              {/* 미팅 만들기 */}
              <Route path="/create-meeting" element={<CreateMeeting />} />
              <Route
                path="/create-meeting/detail"
                element={<CreateMeetingDetail />}
              />
              {/* 채팅방 */}
              <Route
                path="/meeting-chat-room/:id"
                element={<MeetingChatRoom />}
              />
              {/* 미팅 수정하기 */}
              <Route path="/edit-meeting/:id" element={<EditMeeting />} />
              <Route
                path="/edit-meeting/:id/detail"
                element={<EditMeetingDetail />}
              />
              {/* 참여 요청 목록 */}
              <Route path="/request-list/:id" element={<RequestProfile />} />
            </Routes>
          </BrowserRouter>
        </div>
      </QueryClientProvider>
    </RecoilRoot>
  );
};

export default App;

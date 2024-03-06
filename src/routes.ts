export const ROUTES = {
  // 로그인
  SIGN_IN: "/sign-in",
  CHANGE_PASSWORD: "/sign-in/change-password",
  // 회원가입
  SIGN_UP: "/sign-up",
  AGREEMENTS: "/sign-up/agreement",
  DETAIL: "/sign-up/detail",
  PASSWORD: "/sign-up/password",
  // 미팅리스트
  MEETING_LIST: "/meeting-list",
  MEETING_LIST_ID: "/meeting-list/:id",
  SEARCH: "/search",
  // 채팅리스트
  CHAT_LIST: "/chat-list",
  // 프로필
  PROFILE: "/profile",
  PORFILE_SETTING: "/profile/setting",
  SETTING_EDIT: "/setting/edit",
  SETTING_WITHDRAWAL: "/setting/withdrawal",
  AGREEMENT: "/agreement",
  NOTICE: "/notice",
  BLOCKLIST: "/block-list",
  REPORT: "/report",
  // 미팅만들기
  CREATE_MEETING: "/create-meeting",
  CREATE_MEETING_DETAIL: "/create-meeting/detail",
  // 채팅방
  MEETING_CHAT_ROOM_ID: "/meeting-chat-room/:id",
  // 미팅수정하기
  EDIT_MEETING_ID: "/edit-meeting/:id",
  EDIT_MEETING_ID_DETAIL: "/edit-meeting/:id/detail",
  // 참여요청목록
  REQUEST_LIST_ID: "/request-list/:id",
  // 개인정보처리방침
  PERSONAL_INFO: "/personal-info",
} as const;

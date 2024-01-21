import { atom } from "recoil";

// 유저 정보 부분
export const userEmailAtom = atom({
  key: "Email",
  default: "",
});

export const userPasswordAtom = atom({
  key: "UserPassWord",
  default: "",
});

export const userNicknameAtom = atom({
  key: "Nickname",
  default: "",
});

export const userIntroduceAtom = atom({
  key: "Introduce",
  default: "",
});

export const userGenderAtom = atom({
  key: "Gender",
  default: "",
});

export const userBirthAtom = atom({
  key: "Birth",
  default: "",
});

export const userHeightAtom = atom({
  key: "Height",
  default: "",
});

export const userWeightAtom = atom({
  key: "Weight",
  default: "",
});

// 미팅 방 부분
export const meetingTitleAtom = atom({
  key: "MeetingTitle",
  default: "",
});

export const meetingDescAtom = atom({
  key: "MeetingDesc",
  default: "",
});

// 방 삭제 할 때 모달 띄우기.
export const SnackBarAtom = atom({
  key: "SnackBar",
  default: false,
});

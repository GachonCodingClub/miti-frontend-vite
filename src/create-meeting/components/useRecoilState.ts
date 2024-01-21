import { useRecoilState } from "recoil";
import {
  meetingDescAtom,
  meetingTitleAtom,
  userNicknameAtom,
} from "../../atoms";

export const useRecoilStates = () => {
  const meetingTitleState = useRecoilState(meetingTitleAtom);
  const meetingDescState = useRecoilState(meetingDescAtom);
  const userNicknameState = useRecoilState(userNicknameAtom);

  return {
    meetingTitle: meetingTitleState[0],
    meetingDesc: meetingDescState[0],
    myNickname: userNicknameState[0],
  };
};

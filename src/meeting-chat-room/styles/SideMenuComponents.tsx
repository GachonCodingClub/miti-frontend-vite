import { motion } from "framer-motion";
import styled from "styled-components";
import { DialogLeftBtn } from "../../components/styles/Button";

// 오른쪽 메뉴 나오는 애니메이션
export const MenuAnimation = {
  hidden: {
    x: 600, // 시작 위치(오른쪽으로 x 600만큼 더 간 위치)
  },
  visible: {
    x: 0,
    transition: {
      damping: 20, // 바운스 정도
      stiffness: 1000, // 바운스 강도
      duration: 0.4, // 0.4초 걸림
    },
  },
};

// 오른쪽 메뉴 프레임
export const RightMenuFrame = styled(motion.div)`
  width: 70%;
  height: 100vh;
  top: 0;
  right: 0;
  z-index: 31;
  background: #fff;
  position: fixed;
  overflow: hidden;
`;

// 메뉴에 나오는 미팅 제목/설명 프레임
export const MenuMeetingTitleAndDescFrame = styled.div`
  padding-top: 64px;
  margin: auto;
  display: flex;
  width: 80%;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
`;

// 메뉴에 나오는 미팅 제목
export const MenuMeetingTitle = styled.span`
  align-self: stretch;
  color: var(--Grey-grey800, #2f2a28);

  font-weight: 700;
  line-height: 20px;
`;

// 메뉴에 나오는 미팅 설명
export const MenuMeetingDesc = styled(MenuMeetingTitle)`
  color: var(--Grey-grey700, #56504f);
  font-size: 14px;
  letter-spacing: -0.224px;
`;

// 회색 가로 선
export const GrayLine = styled.div`
  margin-top: 32px;
  width: 100%;
  height: 8px;
  background: var(--Grey-grey40, #f2f0ef);
`;

// 메뉴의 세부정보/참여자 래퍼
export const MenuDetailAndMemberWrapper = styled.div`
  display: flex;
  margin: auto;
  width: 80%;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
  padding-top: 32px;
`;

// 세부정보/버튼 컨테이너
export const MenuDetailAndButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
  align-self: stretch;
`;

// 세부 정보 프레임
export const MenuDetailFrame = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
`;

// 세부 정보 텍스트
export const MenuDetailText = styled.span`
  color: var(--Grey-grey500, #767170);
  font-size: 14px;
  letter-spacing: -0.224px;
`;

// 날짜 장소 인원 컨테이너
export const MenuDateLocationMemberContainer = styled(MenuDetailFrame)`
  gap: 8px;
`;

// 날짜 장소 인원 프레임
export const MenuDateLocationFrame = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  align-self: stretch;
`;

// 날짜 장소 인원 텍스트
export const MenuDateLocationText = styled.span`
  flex: 1 0 0;
  color: var(--Grey-grey800, #2f2a28);

  font-weight: 500;
  line-height: 20px;
`;

// 방장만 보이는 미팅 수정 버튼
export const MenuModifyMeetingButton = styled.button`
  display: flex;
  padding: 16px 12px;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  border-radius: 8px;
  border: 1px solid var(--Grey-grey100, #dedbd9);
  background: #fff;

  // 텍스트 부분
  color: var(--Grey-grey500, #767170);
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.224px;
`;

// 작은 가로 선
export const MenuSmallGrayLine = styled.div`
  width: 80%;
  height: 1px;
  background: #ebe8e7;
  margin: 32px auto;
`;

// 참여자/참여요청버튼 래퍼
export const MenuMemberAndReqButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
  align-self: stretch;
  width: 80%;
  margin: auto;
`;

// 참여자 컨테이너
export const MenuMemberContainer = styled(MenuDetailFrame)``;

// 참여자 프레임
export const MenuMemberFrame = styled(MenuDateLocationMemberContainer)`
  overflow-y: auto;
`;

// 유저 프로필 프레임
export const MenuUserProfileFrame = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
`;

// 방장 프레임
export const MenuMasterFrame = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
`;

// 유저 닉네임
export const MenuUserNickname = styled.span`
  color: var(--Grey-grey800, #2f2a28);
  font-weight: 500;
  line-height: 20px;
`;

// 유저 디테일 프레임
export const MenuUserDetailFrame = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  padding-bottom: 16px;
`;

// 유저 디테일 텍스트
export const MenuUserDetailText = styled(MenuDetailText)`
  padding-right: 8px;
`;

// 참여 요청 목록 버튼
export const ParticipationReqButton = styled(MenuModifyMeetingButton)``;

// 미팅 삭제하고 나가기
export const MenuDeleteMeetingAndRunButton = styled.button`
  color: var(--Grey-grey500, #767170);
  font-size: 12px;
  line-height: 14px;
  letter-spacing: -0.12px;
  width: 100%;
  margin: 10% auto;
`;

// 미팅 나가기
export const MenuExitMeetingButton = styled(MenuDeleteMeetingAndRunButton)``;

// 사용자 프로필 인터페이스
export interface IUser {
  description?: string;
  userId?: string;
  username?: string;
  nickname: string;
  age: number;
  gender: "MALE" | "FEMALE" | string;
  height: string | number;
  weight: string | number;
}

export const ProfileLeftButton = styled(DialogLeftBtn)`
  white-space: nowrap;
  width: 148px;
`;

export const ProfileRightButton = styled(ProfileLeftButton)`
  background: #d05438;
`;
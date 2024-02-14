import styled from "styled-components";
import { Screen } from "../../components/styles/Screen";

export const CreateMeetingDetailScreen = styled(Screen)`
  padding-top: 56px;
`;

export const DatePlaceMemberFrame = styled.div`
  width: 100%;
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  padding-top: 26px;
`;

// 추가 멤버 프레임
export const AddMemberFrame = styled.div`
  padding-top: 32px;
  display: inline-flex;
  flex-direction: column;
  width: 100%;
  gap: 16px;
`;

// 추가 멤버 컨테이너
export const AddMemberContainer = styled.div`
  display: flex;
  align-items: center;
`;

// 추가 멤버 삭제 버튼
export const DeleteMemberButton = styled.button`
  padding: 10px;
  margin: 5px;
  font-weight: 700;
  color: var(--Grey-grey500, #767170);
`;

// 닉네임으로 참여자 추가(선택 입력)
export const AddMemberText = styled.div`
  color: var(--Grey-grey500, #767170);
  font-size: 14px;
  letter-spacing: -0.224px;
`;

// 사용자 추가 + 버튼
export const AddMemberButton = styled.button`
  font-size: 2rem;
  color: var(--Grey-grey500, #767170);
`;

// 추가 멤버 닉네임 텍스트
export const AddedNicknameText = styled.div`
  color: var(--Grey-grey500, #767170);
  font-weight: 600;
`;

// 최종 제출 버튼 부분
export const SubmitButtonFrame = styled.div`
  display: flex;
  width: 100%;
  padding: 32px 16px 24px 16px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  background: var(--grey-scale-coolgrey-00, #fff);

  /* Bottom btn shadow */
  box-shadow: 0px -2px 4px 0px rgba(18, 22, 26, 0.04);
`;

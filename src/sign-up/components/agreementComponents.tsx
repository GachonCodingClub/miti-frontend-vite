import styled from "styled-components";
import { Screen } from "../../components/Screen";

// 전체 스크린
export const AgreementScreen = styled(Screen)`
  padding-top: 56px;
  padding-bottom: 112px;
`;

// 다음 약관에 동의해주세요 타이틀
export const AgreementTitle = styled.div`
  color: var(--grey-grey-800, #2f2a28);
  margin-top: 24px;
  font-size: 24px;
  font-weight: 500;
  line-height: 30px;
`;

// 모두 선택하는 부분 프레임
export const AllCheckFrame = styled.div`
  margin-top: 24px;
  display: flex;
  padding: 16px 16px 0px 16px;
  align-items: center;
`;

// 각각 체크하는 체크박스의 전체 컨테이너
export const CheckBoxContainer = styled.div`
  margin-top: 34px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
`;

// 체크박스 input 하나씩 담은 프레임
export const EachCheckBoxFrame = styled.div`
  padding: 16px;
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

// 체크박스 input
export const CheckBox = styled.input`
  appearance: none;
  border: 1.5px solid gray;
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;

  &:checked {
    border-color: transparent;
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
    background-size: 100% 100%;
    background-position: 50%;
    background-repeat: no-repeat;
    background-color: #fc7e62;
  }
`;

// 체크박스 옆에 텍스트
export const CheckText = styled.span`
  color: var(--Grey-grey800, #2f2a28);
  font-weight: 500;
  line-height: 20px;
  margin-left: 16px;
`;

// 내용보기 버튼
export const ViewContentsButton = styled.button`
  color: var(--Grey-grey500, #767170);
  font-weight: 500;
  line-height: 20px;
`;

// 팝업창 프레임
export const ViewContentsPopUpFrame = styled.div`
  display: flex;
  width: 500px; /* 흠 */
  padding: 24px 16px 24px 16px;
  flex-direction: column;
  align-items: center;
  position: relative;
  margin: auto;
  top: 10%;
  border-radius: 12px;
  background: var(--grey-scale-coolgrey-00, #fff);
`;

// 팝업창 타이틀
export const ViewContentsTitle = styled.span`
  color: var(--Grey-grey800, #2f2a28);
  font-size: 24px;
  font-weight: 500;
  padding: 16px;
`;

// 팝업창 안에 내용 담은 div
export const ViewContents = styled.div`
  height: 396px;
  overflow-y: scroll;
  padding: 16px;
  background: #f8f9fb;
  white-space: pre-line; /* 여기에 추가 */
`;

// 팝업 닫기 프레임
export const ClosePopUpButtonFrame = styled.div`
  width: 100%;
  padding: 16px;
  margin-top: 8px;
`;

// 다음 버튼 프레임
export const NextButtonFrame = styled.div`
  position: fixed;
  width: 100%;
  max-width: 36rem;
  padding: 0 16px;
  bottom: 0;
  padding-bottom: 50px;
`;

// 다음 버튼
export const NextButton = styled.div<{ state: boolean }>`
  display: flex;
  padding: 16px 12px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  background: var(--gd, linear-gradient(91deg, #ffbf7b 0%, #ff7152 100%));
  display: ${(props) => (props.state ? "block" : "none")};

  // 텍스트
  color: var(--grey-grey-00, #fff);
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.224px;
`;

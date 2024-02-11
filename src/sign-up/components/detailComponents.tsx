import { motion } from "framer-motion";
import styled from "styled-components";
import { Screen } from "../../components/Screen";

export const DetailSetScreen = styled(Screen)`
  padding-top: 56px;
  padding-bottom: 112px;
`;

export const DetailTitle = styled.div`
  color: var(--grey-grey-800, #2f2a28);
  margin-top: 24px;
  font-size: 24px;
  font-weight: 500;
  line-height: 30px;
`;

// 인풋들을 담고 있는 프레임
export const DetailFrame = styled.div`
  margin-top: 34px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 37px;
  width: 100%;
`;

// 한줄소개 프레임
export const IntroduceFrame = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

// 글자 수
export const CharCount = styled.div`
  color: var(--grey-grey-500, #767170);
  font-size: 0.8rem;
`;

// 성별 고르기
export const SelectBtnFrame = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
`;

export const SelectBtnText = styled.span`
  color: var(--grey-grey-500, #767170);
  font-size: 14px;
  letter-spacing: -0.224px;
`;

export const SelectButtonContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: flex-start;
`;

// 여기부터 시트
export const HeightSheet = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;

  border: 1px #000000 solid;
  border-radius: 24px 24px 0px 0px;
  background: var(--grey-grey-00, #fff);
  margin-left: -24px;
  z-index: 100;
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: 36rem;
  padding: 0 0 56px 0;
`;

export const SheetTitleFrame = styled.div`
  display: flex;
  padding: 20px 24px;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`;

export const SheetTitle = styled.span`
  color: var(--grey-grey-800, #2f2a28);
  font-size: 18px;
  font-weight: 500;
  line-height: 22px;
`;

export const SheetXIcon = styled.svg`
  width: 24px;
  height: 24px;
`;

export const SheetBodyFrame = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
`;

export const SheetBodyRow = styled.div`
  display: flex;
  align-items: flex-start;
  align-self: stretch;
`;

export const SheetElement = styled.div`
  display: flex;
  padding: 18px 24px;
  align-items: center;
  flex: 1 0 0;
  background: #fff;
`;

export const SheetText = styled.span`
  flex: 1 0 0;
  color: var(--grey-grey-700, #56504f);
  text-align: center;
  line-height: 20px;
`;

export const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  flex-shrink: 0;

  background: rgba(0, 0, 0, 0.24);
`;

export const SheetAnimation = {
  hidden: {
    y: 200, // 시작 위치 (아래에서 위로 이동)
  },
  visible: {
    y: 0, // 최종 위치 (화면 중앙)

    transition: {
      damping: 20, // 애니메이션의 바운스 정도
      stiffness: 100, // 애니메이션의 빠르기
    },
  },
};

export const SnackBarFrame = styled(motion.div)`
  border-radius: 24px 24px 0px 0px;
  border: 1px solid #000;
  background: var(--grey-grey-00, #fff);
`;

export const SnackBarAnimation = {
  hidden: {
    y: 100,
  },
  visible: {
    y: -25,
    transition: {
      damping: 20, // 애니메이션의 바운스 정도
      stiffness: 100, // 애니메이션의 빠르기
    },
  },
};

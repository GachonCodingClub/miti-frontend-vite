import styled from "styled-components";
import { OrangeSmButton } from "./styles/Input";
import { ArrowbackIcon } from "./styles/Icons";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface ITopBar {
  title?: string;
  leftIcon?: ReactNode; // 어떤 종류의 React 엘리먼트든 사용할 수 있도록
  rightIcon?: ReactNode;
  onLeftIconClick?: () => void;
  onRightIconClick?: () => void;
}

const Wrapper = styled.div`
  display: flex;
  position: fixed;
  width: 100%;

  max-width: 36rem;
  padding: 8px 8px 0px 8px;

  align-items: center;
  gap: 16px;
  background: var(--grey-grey-00, #fff);
  z-index: 10;
`;

const TopBarText = styled.span`
  flex: 1 0 0;
  color: var(--grey-grey-800, #2f2a28);
  font-weight: 500;
  line-height: 24px;
  letter-spacing: -0.32px;
  padding: 8px;
`;

const LeftIconWrapper = styled.div`
  padding: 16px;
`;
const RightIconWrapper = styled.div`
  padding: 16px;
`;

export const TopBar = ({
  title,
  leftIcon,
  rightIcon,
  onLeftIconClick,
  onRightIconClick,
}: ITopBar) => {
  return (
    <Wrapper>
      {leftIcon && (
        <LeftIconWrapper onClick={onLeftIconClick}>{leftIcon}</LeftIconWrapper>
      )}
      <TopBarText>{title}</TopBarText>
      {rightIcon && (
        <RightIconWrapper onClick={onRightIconClick}>
          {rightIcon}
        </RightIconWrapper>
      )}
    </Wrapper>
  );
};

// 미팅 만들기/수정하기에만 쓰이는 다음버튼 있는 TopBar
export const TopBarNextButton = ({ title, onRightIconClick }: ITopBar) => {
  const navigate = useNavigate();
  return (
    <Wrapper>
      <div className="p-3 flex items-center">
        <ArrowbackIcon onClick={() => navigate(-1)} />
        <TopBarText>{title}</TopBarText>
        <OrangeSmButton text="다음" onClick={onRightIconClick || (() => {})} />
      </div>
    </Wrapper>
  );
};

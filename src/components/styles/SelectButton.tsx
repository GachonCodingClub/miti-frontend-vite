import styled from "styled-components";

interface ButtonProps {
  active?: boolean;
}

const LeftButton = styled.button<ButtonProps>`
  display: flex;
  padding: 12px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  flex: 1 0 0;
  align-self: stretch;
  border-radius: 8px 0px 0px 8px;
  border: 1px solid
    ${(props) =>
      props.active
        ? "var(--primary-orangered-800, #FF7152)"
        : "var(--grey-grey-300, #C9C5C5)"};
  background: ${(props) => (props.active ? "#FFEEEA" : "white")};
  color: ${(props) =>
    props.active
      ? "var(--primary-orangered-800, #FF7152)"
      : "var(--grey-grey-300, #C9C5C5)"};
`;

const RightButton = styled(LeftButton)`
  border-radius: 0px 8px 8px 0px;
`;

const Text = styled.span<ButtonProps>`
  color: ${(props) =>
    props.active
      ? "var(--primary-orangered-800, #FF7152)"
      : "var(--grey-grey-800, #2F2A28)"};
  line-height: 20px;
`;

interface IButtonText {
  text: string;
  active: boolean;
  onClick: () => void;
}

export const LeftSelectButton = ({ text, active, onClick }: IButtonText) => {
  return (
    <LeftButton active={active ? true : false} onClick={onClick}>
      <Text active={active ? true : false}>{text}</Text>
    </LeftButton>
  );
};

export const RightSelectButton = ({ text, active, onClick }: IButtonText) => {
  return (
    <RightButton active={active ? true : false} onClick={onClick}>
      <Text active={active ? true : false}>{text}</Text>
    </RightButton>
  );
};

import React, { ForwardedRef } from "react";
import {
  CautionMessage,
  InputBoxText,
  InputBoxWrapper,
  InputElement,
  OrangeSmButton,
  SVGBtn,
  SVGInput,
  SVGInputContainer,
  StyledInput,
} from "./styles/Input";
import styled from "styled-components";

// 기본 인풋박스
interface IInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder: string;
  type: string;
  disable?: boolean;
  maxLength?: number;
}

export const MyInputBox = ({
  label,
  value,
  onChange,
  error,
  placeholder,
  type,
  maxLength,
}: IInputProps) => {
  return (
    <InputElement
      placeholder={placeholder}
      label={label}
      type={type}
      value={value}
      onChange={onChange}
      caution={error}
      maxLength={maxLength}
    />
  );
};

// 옆에 주황 버튼 같이 있는거
interface IInputButtonProps extends IInputProps {
  btnText: string;
  onClick: () => void;
}

const InputBoxBtnContainer = styled.div<{ error?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
  opacity: 0.9;
  border-bottom: 1px solid ${(props) => (props.error ? "#d05438" : "#c9c5c5")};
`;

export const MyInputBoxButton = ({
  label,
  value,
  onChange,
  error,
  placeholder,
  type,
  btnText,
  onClick,
  disable,
  maxLength,
}: IInputButtonProps) => {
  const hasLabel = !!label;
  const hasCaution = !!error;
  return (
    <InputBoxWrapper>
      {hasLabel && <InputBoxText>{label}</InputBoxText>}
      <InputBoxBtnContainer error={hasCaution}>
        <StyledInput
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disable}
          maxLength={maxLength}
        />
        <OrangeSmButton onClick={onClick} text={btnText} />
      </InputBoxBtnContainer>
      {hasCaution && <CautionMessage>{error}</CautionMessage>}
    </InputBoxWrapper>
  );
};

// 옆에 SVG 있는거
interface IInputSVGProps extends IInputProps {
  onClick: () => void;
  svg?: React.ReactNode;
  disable?: boolean;
  pattern?: string;
  showSheet?: boolean;
}

export const MyInputBoxSVG = React.forwardRef<HTMLInputElement, IInputSVGProps>(
  (
    {
      label,
      value,
      onChange,
      error,
      placeholder,
      type,
      onClick,
      svg,
      disable,
      pattern,
      showSheet = false,
    },
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const hasCaution = !!error;
    const handleClick = () => {
      if (showSheet) {
        onClick();
      }
    };
    return (
      <InputBoxWrapper>
        <InputBoxText>{label}</InputBoxText>
        <SVGInputContainer error={hasCaution} onClick={handleClick}>
          <SVGInput
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disable}
            pattern={pattern}
            ref={ref}
          />
          <SVGBtn onClick={onClick}>{svg}</SVGBtn>
        </SVGInputContainer>
        {hasCaution && <CautionMessage>{error}</CautionMessage>}
      </InputBoxWrapper>
    );
  }
);

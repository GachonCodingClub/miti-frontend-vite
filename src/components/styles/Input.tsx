import React from "react";
import { ForwardedRef } from "react";
import styled from "styled-components";

// 작은 인증 오렌지 버튼
interface ButtonProps {
  text: string;
  onClick: () => void;
}

const MyOrangeSmButton = styled.button`
  position: absolute;
  right: 0;
  margin-right: 16px;
  display: inline-flex;
  padding: 4px 8px;
  align-items: flex-start;

  color: var(--primary-orangered-800, #ff7152);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.224px;

  border-radius: 100px;
  border: 1px solid var(--primary-orangered-800, #ff7152);
`;

export const OrangeSmButton = ({ text, onClick }: ButtonProps) => {
  return (
    <MyOrangeSmButton onClick={onClick} type="button">
      {text}
    </MyOrangeSmButton>
  );
};

// 오류 메시지
export const CautionMessage = styled.span`
  color: var(--error-red-800, #d05438);

  font-size: 12px;
  font-weight: 400;
  line-height: 14px;
  letter-spacing: -0.12px;
`;

//
// 기본 Input
//

const StyledContainer = styled.div<{ error?: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: 1px solid ${(props) => (props.error ? "#d05438" : "#c9c5c5")};
`;

const StyledInput = styled.input`
  width: 100%;
  font-size: 14px;
  height: 48px;
  padding: 10px 8px 11px 8px;
  &::placeholder {
    color: #c9c5c5;
  }

  outline: none;
  &:focus {
    border-color: #2f2a28;
  }
`;

const InputBoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  width: 100%;

  background: #fff;
`;

const InputBoxText = styled.span`
  color: var(--grey-grey-500, #767170);
  font-size: 14px;
  letter-spacing: -0.224px;
`;

interface InputElementProps {
  placeholder: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  error?: boolean;
  caution?: string;
  maxLength?: number;
}

export const InputElement = ({
  placeholder,
  type,
  value,
  onChange,
  label,
  caution,
  maxLength,
}: InputElementProps) => {
  const hasCaution = !!caution;
  return (
    <InputBoxWrapper>
      {label && <InputBoxText>{label}</InputBoxText>}
      <StyledContainer error={hasCaution}>
        <StyledInput
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
        />
      </StyledContainer>
      {hasCaution && <CautionMessage>{caution}</CautionMessage>}
    </InputBoxWrapper>
  );
};

//
// 옆에 주황 버튼이 있는 Input
//

const InputBoxBtnContainer = styled.div<{ error?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
  opacity: 0.9;
  border-bottom: 1px solid ${(props) => (props.error ? "#d05438" : "#c9c5c5")};
`;

interface IFirstInputBtn extends InputElementProps {
  disable?: boolean;
  onClick: () => void;
  btnText: string;
}

export const InputBoxBtn = ({
  placeholder,
  label,
  type,
  btnText,
  onClick,
  value,
  onChange,
  caution,
  disable,
  maxLength,
}: IFirstInputBtn) => {
  const hasLabel = !!label;
  const hasCaution = !!caution;

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
      {hasCaution && <CautionMessage>{caution}</CautionMessage>}
    </InputBoxWrapper>
  );
};

//
// SVG 버튼이 끝에 있는 Input
//

export const SVGBtn = styled.div`
  width: 24px;
  height: 24px;
  flex-shrink: 0;
`;

const SVGInputContainer = styled.div<{ error?: boolean }>`
  display: flex;
  width: 100%;
  height: 48px;
  padding: 10px 8px 11px 8px;
  align-items: center;
  border-bottom: 1px solid ${(props) => (props.error ? "#d05438" : "#c9c5c5")};
  opacity: 0.9;
`;

const SVGInput = styled.input`
  flex: 1 0 0;
  color: var(--grey-grey-800, #2f2a28);
  line-height: 20px;
  &::placeholder {
    color: #c9c5c5;
  }
  outline: none;
`;

interface InputProps extends InputElementProps {
  disable?: boolean;
  onClick: () => void;
  svg?: React.ReactNode;
  pattern?: string;
}

export const InputBoxWithSVG = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      placeholder,
      label,
      type,
      onClick,
      value,
      onChange,
      svg,
      caution,
      disable,
      pattern,
    },
    ref: ForwardedRef<HTMLInputElement> // ref 타입 명시
  ) => {
    const hasCaution = !!caution;

    return (
      <InputBoxWrapper>
        <InputBoxText>{label}</InputBoxText>
        <SVGInputContainer error={hasCaution}>
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
        {hasCaution && <CautionMessage>{caution}</CautionMessage>}
      </InputBoxWrapper>
    );
  }
);

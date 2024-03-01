import React from "react";
import { InputBoxBtn, InputBoxWithSVG, InputElement } from "./styles/Input";

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
  return (
    <InputBoxBtn
      placeholder={placeholder}
      label={label}
      type={type}
      value={value}
      onChange={onChange}
      btnText={btnText}
      onClick={onClick}
      caution={error}
      disable={disable}
      maxLength={maxLength}
    />
  );
};

// 옆에 SVG 있는거
interface IInputSVGProps extends IInputProps {
  onClick: () => void;
  svg?: React.ReactNode;
  disable?: boolean;
  pattern?: string;
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
    },
    ref
  ) => {
    return (
      <InputBoxWithSVG
        placeholder={placeholder}
        label={label}
        type={type}
        onClick={onClick}
        value={value}
        onChange={onChange}
        svg={svg}
        disable={disable}
        caution={error}
        pattern={pattern}
        ref={ref}
      />
    );
  }
);

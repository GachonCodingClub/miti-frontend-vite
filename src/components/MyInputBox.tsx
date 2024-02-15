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
}

export const MyInputBox = ({
  label,
  value,
  onChange,
  error,
  placeholder,
  type,
}: IInputProps) => {
  return (
    <InputElement
      placeholder={placeholder}
      label={label}
      type={type}
      value={value}
      onChange={onChange}
      caution={error}
    />
  );
};

// 옆에 주황 버튼 같이 있는거
interface IInputButtonProps extends IInputProps {
  btnText: string;
  onClick: () => void;
  disable?: boolean;
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
    />
  );
};

// 옆에 SVG 있는거
interface IInputSVGProps extends IInputProps {
  onClick: () => void;
  svg?: React.ReactNode; // 추가: SVG를 props로 받음
  disable?: boolean;
  pattern?: string;
}

export const MyInputBoxSVG = ({
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
}: IInputSVGProps) => {
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
    />
  );
};

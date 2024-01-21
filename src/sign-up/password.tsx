import { useRecoilState } from "recoil";
import { useState } from "react";
import { FixedButtonBox, LongOrangeBtn } from "../components/Button";
import {
  PasswordSetScreen,
  TitleFrame,
  Title,
  SubTitle,
  PassWordFrame,
} from "./components/passwordComponents";
import { userPasswordAtom } from "../atoms";
import { MyInputBox } from "../components/MyInputBox";
import { SIGNUP_ROUTES } from "../routes";
import { TopBar } from "../components/TopBar";
import { ArrowbackIcon } from "../components/Icons";
import { useNavigate } from "react-router-dom";

export default function PasswordSetting() {
  const navigate = useNavigate(); // useNavigate 사용

  // inputPassword : 사용자가 지금 폼에 입력
  // recoilPassword, userPassword = recoil로 저장할 비밀번호

  // recoil 사용 부분
  const [recoilPassword, setRecoilPassword] = useRecoilState(userPasswordAtom);
  console.log(recoilPassword);
  // 비밀번호 입력
  const inputPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 비밀번호 유효성 검사

    const newPassword = e.target.value;
    setInputUserPW(newPassword);
  };

  // 비밀번호 확인 입력
  const veriPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setVeriUserPW(newPassword);
  };

  // 사용자가 입력하는 비번
  const [inputUserPW, setInputUserPW] = useState("");
  const [inputUserPWError, setInputUserPWError] = useState("");

  // 사용자가 입력하는 비번 확인
  const [veriUserPW, setVeriUserPW] = useState("");
  const [veriUserPWError, setVeriUserPWError] = useState("");

  // 다음 버튼, 비밀번호를 atom에 저장시킴
  const savePasswordClick = () => {
    // 비밀번호 제대로 입력 했는지 유효성 검증
    const isPasswordValid = (password: string) => {
      const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,}$/;
      return regex.test(password);
    };
    setRecoilPassword(veriUserPW);

    if (!isPasswordValid(inputUserPW)) {
      setInputUserPWError(
        "영문, 특수문자, 숫자 포함 8자리 이상 입력해 주세요."
      );
      return;
    } else {
      setInputUserPWError("");
    }

    if (inputUserPW === veriUserPW) {
      setVeriUserPWError("");
      navigate(`${SIGNUP_ROUTES.DETAIL}`);
      return;
    } else {
      setVeriUserPWError("비밀번호를 확인해주세요");
      return;
    }
  };

  return (
    <>
      <TopBar leftIcon={<ArrowbackIcon onClick={() => navigate(-1)} />} />
      <PasswordSetScreen>
        <TitleFrame>
          <Title>비밀번호를 설정해 주세요</Title>
          <SubTitle>
            영문, 특수문자, 숫자 포함 8자리 이상 입력해 주세요
          </SubTitle>
        </TitleFrame>
        <form style={{ width: "100%", position: "relative" }}>
          <PassWordFrame>
            <MyInputBox
              placeholder="비밀번호 입력"
              label="비밀번호"
              type="password"
              value={inputUserPW}
              onChange={inputPassword}
              error={inputUserPWError}
            />

            <MyInputBox
              placeholder="비밀번호 확인 입력"
              label="비밀번호 확인"
              type="password"
              value={veriUserPW}
              onChange={veriPassword}
              error={veriUserPWError}
            />
          </PassWordFrame>
        </form>
      </PasswordSetScreen>
      <FixedButtonBox>
        <LongOrangeBtn text="다음" onClick={savePasswordClick} />
      </FixedButtonBox>
    </>
  );
}

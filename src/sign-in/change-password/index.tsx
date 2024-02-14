import styled from "styled-components";
import { TopBar } from "../../components/TopBar";
import { Screen } from "../../components/styles/Screen";
import { ArrowbackIcon } from "../../components/styles/Icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { SignUpFrame, SignUpTitle } from "../../sign-up";
import { MyInputBox, MyInputBoxButton } from "../../components/MyInputBox";
import { Overlay } from "../../sign-up/components/detailComponents";
import {
  DialogOneBtn,
  FixedButtonBox,
  LongOrangeBtn,
} from "../../components/styles/Button";
import { PassWordFrame } from "../../sign-up/components/passwordComponents";
import { ROUTES } from "../../routes";

export const ChangePWScreen = styled(Screen)`
  padding: 0;
  padding: 56px 16px 112px 24px;
`;

export default function ChangePassword() {
  const [token, setToken] = useState(""); // 추가: 토큰 상태 추가
  useEffect(() => {
    // 컴포넌트가 마운트될 때 localStorage에서 토큰을 가져와 상태에 설정
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const navigate = useNavigate();

  // 처음 이메일 입력하고 인증메일 보내기
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const [showDialog, setShowDialog] = useState(false);

  // onClick
  const onClick = () => {
    const validateEmail = (email: string) => {
      const regex = /@gachon\.ac\.kr$/;
      return regex.test(email);
    };

    if (!validateEmail(email)) {
      setError("지원하는 대학교 이메일이 아닙니다.");
      return;
    } else {
      setError("");
    }
    setShowDialog(true);
    setBtnText("재전송");
    setShowInputBox(true);
    const formData = new URLSearchParams();
    // 이메일을 변수에 저장
    formData.append("email", email);
    const CertiUrl = `${
      import.meta.env.VITE_BASE_URL
    }/auth/certification/password?email=${email}`;

    // Fetch
    fetch(CertiUrl, {
      method: "POST",
      mode: "cors",
      body: formData.toString(),
    })
      .then((response) => {
        if (!response.ok) {
          console.error(
            `API 오류: ${response.status} - ${response.statusText}`
          );
        }
        return response.json();
      })
      .then((data) => {
        console.log("이메일 인증", data);
      })
      .catch((error) => {
        console.error(error);
        setError("");
      });
  };
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [isCertiDisabled, setIsCertiDisabled] = useState(false);

  const onCertiButtonClick = () => {
    const formData = new URLSearchParams();

    const AuthUrl = `${
      import.meta.env.VITE_BASE_URL
    }/auth/certification/confirm?email=${email}&certificationNumber=${certiNum}`;

    fetch(AuthUrl, {
      method: "POST",
      mode: "cors",
      body: formData.toString(),
    })
      .then((response) => {
        if (!response.ok) {
          console.error(
            `API 오류: ${response.status} - ${response.statusText}`
          );
          return response.json();
        }

        return response.json();
      })
      .then((data) => {
        if (data === false) {
          setCertiError("인증 번호를 다시 확인해 주세요.");
        } else {
          setCertiError("");
          setIsCertiDisabled(true);
        }
      })
      .catch((error) => {
        console.error(error);
        setCertiError("에러임");
      });

    formData.append("certiNum", certiNum);
  };

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
  };

  const [btnText, setBtnText] = useState("인증");
  const [showInputBox, setShowInputBox] = useState(false);

  // 사용자가 받은 인증번호 맞는지 검사
  const [certiNum, setCertiNumber] = useState("");
  const [certiError, setCertiError] = useState("");

  const onCertiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCertiNum = e.target.value;
    setCertiNumber(newCertiNum);
  };

  // 변경 완료 다이얼로그
  const [completeDialog, setCompleteDialog] = useState(false);

  const onSubmitAuth = async () => {
    const isPasswordValid = (password: string) => {
      const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,}$/;
      return regex.test(password);
    };

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
    } else {
      setVeriUserPWError("비밀번호를 확인해주세요");
      return;
    }

    const AuthUrl = `${import.meta.env.VITE_BASE_URL}/auth/password`;

    // 이 시점에서 formData에 필요한 데이터를 추가해야 함
    const bodyData = {
      email: email,
      newPassword: veriUserPW,
      certificationNumber: certiNum,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // 토큰을 헤더에 추가
    };

    try {
      const response = await fetch(AuthUrl, {
        method: "PATCH",
        mode: "cors",
        body: JSON.stringify(bodyData),
        headers: headers,
      });

      if (!response.ok) {
        console.error(`API 오류: ${response.status} - ${response.statusText}`);
        return response.json();
      }
      const data = await response.json();
      console.log("비밀번호 변경", data);
      setCompleteDialog(true);
    } catch (error) {
      console.error(error);
      setCertiError("에러임");
    }
  };

  // 사용자가 입력하는 비번
  const [inputUserPW, setInputUserPW] = useState("");
  const [inputUserPWError, setInputUserPWError] = useState("");

  // 사용자가 입력하는 비번 확인
  const [veriUserPW, setVeriUserPW] = useState("");
  const [veriUserPWError, setVeriUserPWError] = useState("");

  // 비밀번호 입력
  const onInputPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 비밀번호 유효성 검사

    const newPassword = e.target.value;
    setInputUserPW(newPassword);
  };

  // 비밀번호 확인 입력
  const onVeriPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setVeriUserPW(newPassword);
  };
  return (
    <>
      <TopBar leftIcon={<ArrowbackIcon onClick={() => navigate(-1)} />} />
      <ChangePWScreen>
        <SignUpTitle>비밀번호 변경</SignUpTitle>

        <SignUpFrame>
          <form>
            <MyInputBoxButton
              placeholder="miti_001@gachon.ac.kr"
              label="대학교 이메일"
              type="email"
              btnText={btnText}
              onClick={onClick}
              value={email}
              onChange={onEmailChange}
              error={error}
              disable={isInputDisabled}
            />
          </form>
          {showDialog && (
            <Overlay style={{ zIndex: "30" }}>
              <DialogOneBtn
                title="인증 메일이 전송되었습니다."
                contents=""
                onRightClick={() => {
                  setShowDialog(false);
                  setIsInputDisabled(true);
                }}
                right="닫기"
              />
            </Overlay>
          )}
          {showInputBox && !error && (
            <form
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: "25px",
              }}
            >
              <MyInputBoxButton
                placeholder="인증 번호 입력"
                label="인증 번호"
                type="text"
                value={certiNum}
                onChange={onCertiChange}
                error={certiError}
                btnText="인증"
                onClick={onCertiButtonClick}
                disable={isCertiDisabled}
              />
            </form>
          )}
        </SignUpFrame>
        <PassWordFrame>
          {showInputBox && !error && (
            <MyInputBox
              placeholder="비밀번호 입력"
              label="비밀번호"
              type="password"
              value={inputUserPW}
              onChange={onInputPasswordChange}
              error={inputUserPWError}
            />
          )}

          {showInputBox && !error && (
            <MyInputBox
              placeholder="비밀번호 확인 입력"
              label="비밀번호 확인"
              type="password"
              value={veriUserPW}
              onChange={onVeriPasswordChange}
              error={veriUserPWError}
            />
          )}
          {completeDialog && !certiError && (
            <Overlay style={{ zIndex: "30" }}>
              <DialogOneBtn
                title="변경 완료"
                contents=""
                right="메인 화면으로"
                onRightClick={() => {
                  setCompleteDialog(false);
                  navigate(ROUTES.SIGN_IN);
                }}
              />
            </Overlay>
          )}
        </PassWordFrame>
      </ChangePWScreen>
      {showInputBox && !error && (
        <FixedButtonBox>
          <LongOrangeBtn text="인증" onClick={onSubmitAuth} />
        </FixedButtonBox>
      )}
    </>
  );
}

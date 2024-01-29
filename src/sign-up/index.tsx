import styled from "styled-components";
import { useState } from "react";
import { Screen } from "../components/Screen";
import {
  DialogOneBtn,
  FixedButtonBox,
  LongOrangeBtn,
} from "../components/Button";
import { useRecoilState } from "recoil";
import { Overlay } from "./components/detailComponents";
import { userEmailAtom } from "../atoms";
import { MyInputBox, MyInputBoxButton } from "../components/MyInputBox";
import { ROUTES, SIGNUP_ROUTES } from "../routes";
import { TopBar } from "../components/TopBar";
import { ArrowbackIcon } from "../components/Icons";
import { useNavigate } from "react-router-dom";

const SignUpScreen = styled(Screen)`
  padding-top: 56px;
  padding-bottom: 112px;
`;

export const SignUpTitle = styled.div`
  color: var(--grey-grey-800, #2f2a28);
  margin-top: 24px;
  font-size: 24px;
  font-weight: 500;
  line-height: 30px;
`;

export const SignUpFrame = styled.div`
  margin-top: 64px;
`;

export default function SignUp() {
  //뒤로가기
  const navigate = useNavigate(); // useNavigate 사용

  // recoil 사용 부분
  const [, setRecoilEmail] = useRecoilState(userEmailAtom);

  // 처음 이메일 입력하고 인증메일 보내기
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const [showDialog, setShowDialog] = useState(false);

  // 이메일 중복 검사
  const [overlapError, setOverlapError] = useState(false);

  // onClick
  // 사용자가 인증버튼을 눌렀을 때 인증번호가 보내짐
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

    // 텍스트 재전송으로 바뀜
    setBtnText("재전송");
    // 안보이는 인증번호 인풋 보임
    setShowInputBox(true);
    const formData = new URLSearchParams();

    const CertiUrl = `${
      import.meta.env.VITE_BASE_URL
    }/auth/certification?email=${email}`;

    // Fetch
    fetch(CertiUrl, {
      method: "POST",
      mode: "cors",
      // headers: {},
      body: formData.toString(),
    })
      .then((response) => {
        if (!response.ok) {
          console.error(
            `API 오류: ${response.status} - ${response.statusText}`
          );
          if (response.status === 409) {
            setOverlapError(true);
          }
          return response.json();
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

    // 이메일을 변수에 저장
    formData.append("email", email);
  };

  // onClick누르면 이메일창 disable됨
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  // 이메일 입력란의 값이 변경될 때 호출되는 함수
  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
  };

  // 버튼의 텍스트를 바꾸려고
  const [btnText, setBtnText] = useState("인증");
  // 첨에 안보이는 인증번호 인풋 보이기
  const [showInputBox, setShowInputBox] = useState(false);

  // 사용자가 받은 인증번호 맞는지 검사
  const [certiNum, setCertiNumber] = useState("");
  const [certiError, setCertiError] = useState("");

  // onSubmitAuth
  const onSubmitAuth = () => {
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
          setRecoilEmail(email);
          navigate(`${SIGNUP_ROUTES.PASSWORD}`);
        }
      })
      .catch((error) => {
        console.error(error);
        setCertiError("에러임");
      });

    formData.append("certiNum", certiNum);
  };

  // 인증번호 입력란의 값이 변경될 때 호출되는 함수
  const onCertiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCertiNum = e.target.value;
    setCertiNumber(newCertiNum);
  };

  return (
    <>
      <TopBar leftIcon={<ArrowbackIcon onClick={() => navigate(-1)} />} />
      <SignUpScreen>
        <SignUpTitle>대학교 이메일을 입력해 주세요</SignUpTitle>

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
          {overlapError && (
            <Overlay style={{ zIndex: "30" }}>
              <DialogOneBtn
                title="이미 가입된 이메일입니다."
                contents=""
                right="처음으로"
                onRightClick={() => {
                  navigate(`${ROUTES.SIGN_IN}`);
                }}
              />
            </Overlay>
          )}
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

          {showInputBox && !error && !overlapError && (
            <form
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: "25px",
              }}
            >
              <MyInputBox
                placeholder="인증 번호 입력"
                label="인증 번호"
                type="text"
                value={certiNum}
                onChange={onCertiChange}
                error={certiError}
              />
            </form>
          )}
        </SignUpFrame>
      </SignUpScreen>
      {showInputBox && !error && !overlapError && (
        <FixedButtonBox>
          <LongOrangeBtn text="다음" onClick={onSubmitAuth} />
        </FixedButtonBox>
      )}
    </>
  );
}
import styled from "styled-components";
import { LongOrangeBtn } from "../components/styles/Button";
import { useEffect, useState } from "react";
import { Screen } from "../components/styles/Screen";
import { ROUTES } from "../routes";
import { InputElement } from "../components/styles/Input";
import { Link, useNavigate } from "react-router-dom";
import { useOneBtnDialog } from "../hooks/useOntBtnDialog";
import { Dialog } from "../components/Dialog";

// 미티 로고
const MITI = styled.div`
  margin-top: 79px;
  display: flex;
  justify-content: flex-start;
  color: var(--primary-orangered-800, #ff7152);
  text-align: center;
  font-size: 24px;
  font-weight: 900;
  line-height: 24px;
  letter-spacing: -0.48px;
`;
const LoginFrame = styled.div`
  margin-top: 103px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 25px;
`;
// 아이디 찾기 비밀번호 찾기 회원가입 프레임
const SearchFrame = styled.div`
  margin-top: 32px;
  width: 240px;
  display: flex;
  justify-content: space-between;
`;
const SearchText = styled(Link)`
  color: var(--grey-grey-500, #767170);
  text-align: center;
  font-size: 14px;
  letter-spacing: -0.224px;
`;

export default function LogIn() {
  const navigate = useNavigate();

  const { oneBtnDialog, showOneBtnDialog, hideOneBtnDialog } =
    useOneBtnDialog();

  useEffect(() => {
    const userToken = localStorage.getItem("token");
    if (userToken) {
      navigate(ROUTES.MEETING_LIST);
    } else {
      navigate(ROUTES.SIGN_IN);
    }
  }, [navigate]);

  const [loginEmail, setLoginEmail] = useState("");
  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEmail = e.target.value;
    setLoginEmail(inputEmail);
  };

  const [loginPassword, setLoginPassword] = useState("");
  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputPassword = e.target.value;
    setLoginPassword(inputPassword);
  };

  const bodyData = JSON.stringify({
    userId: loginEmail,
    password: loginPassword,
  });
  // 로그인 버튼
  const onLoginClick = () => {
    const LoginURL = `${import.meta.env.VITE_BASE_URL}/auth/sign-in`;
    fetch(LoginURL, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: bodyData,
    })
      .then((response) => {
        if (!response.ok) {
          console.error(`
        API 오류: ${response.status} - ${response.statusText}`);
          // return response.json();
        }
        return response.json();
      })
      .then((data) => {
        if (data?.accessToken) {
          localStorage.setItem("token", data?.accessToken);
          {
            navigate(`${ROUTES.MEETING_LIST}`);
          }
        } else {
          showOneBtnDialog("아이디 혹은 비밀번호를 확인해주세요");
        }
      })
      .then((error) => {
        console.error(error);
      });
  };
  return (
    <Screen>
      <MITI>MITI</MITI>
      <form>
        <LoginFrame>
          <InputElement
            type="email"
            label="대학교 이메일 (@gachon.ac.kr의 이메일만 가능해요)"
            placeholder="miti_001@gachon.ac.kr"
            value={loginEmail}
            onChange={onEmailChange}
          />
          <InputElement
            type="password"
            label="비밀번호"
            placeholder="비밀번호 입력"
            value={loginPassword}
            onChange={onPasswordChange}
          />
        </LoginFrame>
        <div className="w-full mt-8">
          <LongOrangeBtn text="로그인" onClick={onLoginClick} />
        </div>
      </form>
      <div className="w-full flex justify-center">
        <SearchFrame>
          <SearchText to={`${ROUTES.CHANGE_PASSWORD}`}>
            비밀번호 찾기
          </SearchText>
          <SearchText to={`${ROUTES.AGREEMENTS}`}>회원가입</SearchText>
        </SearchFrame>
      </div>

      {oneBtnDialog.open && (
        <Dialog
          title={oneBtnDialog.title}
          right="확인"
          isOneBtn
          onRightClick={hideOneBtnDialog}
        />
      )}
    </Screen>
  );
}

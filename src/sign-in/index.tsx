import styled from "styled-components";
import { LongOrangeBtn } from "../components/Button";
import { useState } from "react";
import { Screen } from "../components/Screen";
import { ROUTES, SIGNUP_ROUTES } from "../routes";
import { InputElement } from "../components/Input";
import { Link, useNavigate } from "react-router-dom";

/**
 * FE 필요한거
 *
 *
 * - 아이디찾기, 키 몸무게(고려)
 * + 비밀번호 찾기
 *
 *
 * 다른데에서 API쓸 때 붙이기
 *
 * 이건 헤더에
 * Authorization: `Bearer ${token}`,
 * 이건 다른 데에
 * const token = localStorage.getItem("MyToken");
 */

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

//
//
//

export default function LogIn() {
  // 미팅리스트로 드가기
  const navigate = useNavigate(); // useNavigate 사용
  // 아이디
  const [loginEmail, setLoginEmail] = useState("");

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEmail = e.target.value;
    setLoginEmail(inputEmail);
  };

  // 비밀번호
  const [loginPassword, setLoginPassword] = useState("");

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputPassword = e.target.value;
    setLoginPassword(inputPassword);
  };

  // 로그인 버튼
  const onLoginClick = () => {
    const LoginURL = `${import.meta.env.VITE_BASE_URL}/auth/sign-in`;

    fetch(LoginURL, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: loginEmail,
        password: loginPassword,
      }),
    })
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          console.error(`
        API 오류: ${response.status} - ${response.statusText}`);
          // return response.json();
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (data.accessToken) {
          console.log("로그인", data);
          localStorage.setItem("token", data.accessToken);
          // const myToken = localStorage.getItem("token");
          // 토큰이 있으면 push
          {
            navigate(`${ROUTES.MEETING_LIST}`);
          }
        } else {
          alert("아이디 혹은 비밀번호를 확인해주세요.");
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
            label="대학교 이메일"
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

        <div
          style={{
            width: "100%",
            marginTop: "32px",
          }}
        >
          <LongOrangeBtn text="로그인" onClick={onLoginClick} />
        </div>
      </form>

      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <SearchFrame>
          <SearchText to={"/"}>아이디 찾기</SearchText>
          <SearchText to={`${ROUTES.CHANGE_PASSWORD}`}>
            비밀번호 찾기
          </SearchText>
          <SearchText to={`${SIGNUP_ROUTES.AGREEMENTS}`}>회원가입</SearchText>
        </SearchFrame>
      </div>
    </Screen>
  );
}

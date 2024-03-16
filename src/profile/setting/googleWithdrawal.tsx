import { useNavigate } from "react-router-dom";
import { ArrowbackIcon } from "../../components/styles/Icons";
import { TopBar } from "../../components/TopBar";
import {
  WithdrawalContents,
  WithdrawalScreen,
  WithdrawalTitle,
} from "../styles/withdrawalStyle";
import {
  Dialog,
  FixedButtonBox,
  LongOrangeBtn,
} from "../../components/styles/Button";
import { useState } from "react";
import { Overlay } from "../../sign-up/styles/detailComponents";
import { getHeaders } from "../../components/getHeaders";

import { InputElement } from "../../components/styles/Input";
import styled from "styled-components";

const LoginFrame = styled.div`
  margin-top: 103px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 25px;
`;

export default function GoogleWithdrawal() {
  const navigate = useNavigate();

  const [showDialog, setShowDialog] = useState(false);

  const LoginURL = `${import.meta.env.VITE_BASE_URL}/auth/sign-in`;
  const DeleteUrl = `${import.meta.env.VITE_BASE_URL}/users/me`;

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

  const handleWithDrawalUser = () => {
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
          const headers = getHeaders(data?.accessToken);
          fetch(DeleteUrl, {
            method: "DELETE",
            mode: "cors",
            headers: headers,
          })
            .then((response) => {
              if (response.ok) {
                localStorage.removeItem("token");
                setShowDialog(false);
                alert("탈퇴가 완료됐어요.");
              } else {
                alert("서버 오류가 발생했어요. 나중에 다시 시도해주세요.!!!!");
              }
            })
            .catch((error) => {
              console.error("네트워크 에러:", error);
              alert("서버 오류가 발생했어요. 나중에 다시 시도해주세요.");
            });
        } else {
          alert("아이디 혹은 비밀번호를 확인해주세요.");
        }
      })
      .then((error) => {
        console.error(error);
      });
  };
  return (
    <>
      <TopBar
        title="회원 탈퇴"
        leftIcon={<ArrowbackIcon onClick={() => navigate(-1)} />}
      />
      <WithdrawalScreen>
        <div className="mt-7">
          <WithdrawalTitle>정말 탈퇴하시겠어요?</WithdrawalTitle>
        </div>
        <div>
          <WithdrawalContents>
            탈퇴 시 계정의 모든 정보는 삭제되며, 삭제된 정보는 복구되지
            않습니다.
          </WithdrawalContents>
        </div>

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
        </form>

        {showDialog && (
          <Overlay>
            <Dialog
              title="탈퇴하기"
              left="다시 생각하기"
              right="탈퇴"
              onLeftClick={() => {
                setShowDialog(false);
              }}
              onRightClick={handleWithDrawalUser}
            />
          </Overlay>
        )}
      </WithdrawalScreen>
      <FixedButtonBox>
        <LongOrangeBtn
          text="탈퇴하기"
          onClick={() => {
            setShowDialog(true);
          }}
        />
      </FixedButtonBox>
    </>
  );
}

import { useNavigate } from "react-router-dom";
import { ArrowbackIcon } from "../../components/styles/Icons";
import { TopBar } from "../../components/TopBar";
import {
  WithdrawalContents,
  WithdrawalScreen,
  WithdrawalTitle,
} from "../styles/withdrawalStyle";
import { FixedButtonBox, LongOrangeBtn } from "../../components/styles/Button";
import { useState } from "react";
import { getHeaders } from "../../components/getHeaders";
import { useLocalStorageToken } from "../../hooks/useLocalStorageToken";
import { ROUTES } from "../../routes";
import { Dialog } from "../../components/Dialog";

export default function Withdrawal() {
  const navigate = useNavigate();

  const [showDialog, setShowDialog] = useState(false);
  const token = useLocalStorageToken();
  const DeleteUrl = `${import.meta.env.VITE_BASE_URL}/users/me`;
  const headers = getHeaders(token);

  const handleWithDrawalUser = () => {
    localStorage.removeItem("token");
    fetch(DeleteUrl, {
      method: "DELETE",
      mode: "cors",
      headers: headers,
    })
      .then((response) => {
        if (response.ok) {
          navigate("/");
          setShowDialog(false);
        } else {
          alert("서버 오류가 발생했어요. 나중에 다시 시도해주세요");
        }
      })
      .catch((error) => {
        console.error("네트워크 에러:", error);
        alert("서버 오류가 발생했어요. 나중에 다시 시도해주세요");
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
        {showDialog && (
          <Dialog
            title="탈퇴하기"
            left="다시 생각하기"
            right="탈퇴"
            onLeftClick={() => {
              setShowDialog(false);
            }}
            onRightClick={handleWithDrawalUser}
          />
        )}
      </WithdrawalScreen>
      <FixedButtonBox>
        <LongOrangeBtn
          text="탈퇴하기"
          onClick={() => {
            if (!token) {
              alert("로그인이 필요해요. 로그인 페이지로 이동합니다");
              navigate(ROUTES.SIGN_IN);
            }
            setShowDialog(true);
          }}
        />
      </FixedButtonBox>
    </>
  );
}

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
import { Overlay } from "../../sign-up/components/detailComponents";
import { getHeaders } from "../../components/getHeaders";
import { useLocalStorageToken } from "../../hooks/useLocalStorageToken";

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
          console.error("탈퇴 실패");
        }
      })
      .catch((error) => {
        console.error("네트워크 에러:", error);
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
          <Overlay>
            <Dialog
              title="탈퇴하기"
              contents=""
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

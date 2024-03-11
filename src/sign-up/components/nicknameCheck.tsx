import React from "react";
import { Overlay } from "../styles/detailComponents";
import { Dialog } from "../../components/styles/Button";
import OneBtnDialog from "../../components/Dialog";

interface INicknameCheck {
  overlapNickname: boolean;
  setOverlapNickname: React.Dispatch<boolean>;
  possibleNickname: boolean;
  setPossibleNickname: React.Dispatch<boolean>;
  isInputDisabled: boolean;
  checkOverlap: () => void;
  checkOverlapPossible: () => void;
}

const NickNameCheckModule = ({
  overlapNickname,
  possibleNickname,
  setPossibleNickname,
  isInputDisabled,
  checkOverlap,
  checkOverlapPossible,
}: INicknameCheck) => {
  return (
    <>
      <OneBtnDialog
        isOpen={overlapNickname}
        title="이미 사용 중인 닉네임입니다."
        onBtnClick={checkOverlap}
        buttonText="닫기"
      />
      {possibleNickname && !isInputDisabled && (
        <Overlay>
          <Dialog
            title="이 닉네임을 사용하시겠습니까?"
            contents="닉네임은 추후에 다시 변경 가능합니다."
            left="아니요"
            onLeftClick={() => {
              setPossibleNickname(false);
            }}
            onRightClick={checkOverlapPossible}
            right="예"
            disable
          />
        </Overlay>
      )}
    </>
  );
};

export default NickNameCheckModule;

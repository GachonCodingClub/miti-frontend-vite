import styled from "styled-components";
import { Overlay } from "../sign-up/styles/detailComponents";

// 다이얼로그
export const DialogContainer = styled.div`
  z-index: 30;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  width: 352px;
  max-width: 36rem;
  padding: 24px 16px 16px 16px;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  border-radius: 12px;
  background: var(--grey-scale-coolgrey-00, #fff);
`;

export const DialogTitle = styled.span`
  align-self: stretch;

  color: var(--grey-grey-800, #2f2a28);
  text-align: center;
  font-weight: 700;
  line-height: 20px;
`;

export const DialogContents = styled.span`
  align-self: stretch;
  color: var(--grey-grey-700, #56504f);
  text-align: center;
  font-size: 14px;
  letter-spacing: -0.224px;
`;

export const DialogBtnFrame = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  align-self: stretch;
`;

export const DialogRightBtn = styled.button<{ isRed?: boolean }>`
  display: flex;
  padding: 16px 12px;
  justify-content: center;
  align-items: center;
  flex: 1 0 0;

  border-radius: 8px;
  background: ${(props) =>
    props.isRed
      ? "var(--gd, linear-gradient(91deg, #d05438 0%, #ff0000 100%))"
      : "var(--gd, linear-gradient(91deg, #ffbf7b 0%, #ff7152 100%))"};
`;

export const DialogRightText = styled.span`
  color: var(--grey-grey-00, #fff);
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.224px;
`;

export const DialogLeftBtn = styled(DialogRightBtn)`
  border: 1px solid var(--grey-grey-100, #dedbd9);
  background: #fff;
`;

export const DialogLeftText = styled(DialogRightText)`
  color: var(--grey-grey-500, #767170);
`;

interface IDialog {
  title: string;
  contents?: string | undefined;
  left?: string;
  right?: string;
  onLeftClick?: () => void;
  onRightClick?: () => void;
  disable?: boolean;
  isOneBtn?: boolean;
  isRed?: boolean;
}

export const Dialog = ({
  title,
  contents,
  left,
  right,
  onLeftClick,
  onRightClick,
  isOneBtn,
  isRed,
}: IDialog) => {
  return (
    <Overlay>
      <DialogContainer>
        <DialogTitle>{title}</DialogTitle>
        <DialogContents>{contents}</DialogContents>
        <DialogBtnFrame>
          {!isOneBtn && (
            <DialogLeftBtn onClick={onLeftClick}>
              <DialogLeftText>{left}</DialogLeftText>
            </DialogLeftBtn>
          )}
          <DialogRightBtn isRed={isRed} onClick={onRightClick}>
            <DialogRightText>{right}</DialogRightText>
          </DialogRightBtn>
        </DialogBtnFrame>
      </DialogContainer>
    </Overlay>
  );
};

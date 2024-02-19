import styled from "styled-components";

// FixedButtonBox는 padding의 영향이 없는 곳까지 빼서 사용해주세요.
export const FixedButtonBox = styled.div`
  position: fixed;
  width: 100%;
  max-width: 36rem;
  padding: 0 16px;
  bottom: 0;
  padding-bottom: 10px;
  background-color: #fff;
`;

export const FixedButtonBoxWithShadow = styled(FixedButtonBox)`
  padding: 16px 16px 24px 16px;
  box-shadow: 0px -2px 4px 0px rgba(18, 22, 26, 0.04);
  display: flex;
  gap: 10px;
`;

const LongOrange = styled.button`
  display: flex;
  width: 100%;
  padding: 16px 12px;
  justify-content: center;
  align-items: center;

  border-radius: 8px;
  background: var(--gd, linear-gradient(91deg, #ffbf7b 0%, #ff7152 100%));
`;

const LongOrangeText = styled.span`
  color: var(--grey-grey-00, #fff);
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.224px;
`;

interface IBtnText {
  text: string;
  onClick: () => void;
}

// 기다란 오렌지색 버튼
export const LongOrangeBtn = ({ text, onClick }: IBtnText) => {
  return (
    <LongOrange onClick={onClick} type="button">
      <LongOrangeText>{text}</LongOrangeText>
    </LongOrange>
  );
};

// 기다란 흰색 버튼
const LongWhite = styled(LongOrange)`
  border: 1px solid var(--grey-grey-100, #dedbd9);
  background: #fff;
`;

const LongWhiteText = styled(LongOrangeText)`
  color: var(--grey-grey-500, #767170);
`;
export const LongWhiteBtn = ({ text, onClick }: IBtnText) => {
  return (
    <LongWhite onClick={onClick} type="button">
      <LongWhiteText>{text}</LongWhiteText>
    </LongWhite>
  );
};

// 작은 오렌지 버튼
const SmOrange = styled.button`
  display: inline-flex;
  padding: 12px 16px;
  justify-content: center;
  align-items: center;

  border-radius: 8px;
  background: var(--gd, linear-gradient(91deg, #ffbf7b 0%, #ff7152 100%));
`;

const SmOrangeText = styled.span`
  color: var(--grey-grey-00, #fff);
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  line-height: 14px;
  letter-spacing: -0.12px;
`;

export const SmallOrangeBtn = ({ text, onClick }: IBtnText) => {
  return (
    <SmOrange onClick={onClick} type="button">
      <SmOrangeText>{text}</SmOrangeText>
    </SmOrange>
  );
};

// 작은 흰색 버튼
const SmWhite = styled(SmOrange)`
  border: 1px solid var(--grey-grey-100, #dedbd9);
  background: #fff;
`;

const SmWhiteText = styled(SmOrangeText)`
  color: var(--grey-grey-500, #767170);
`;

export const SmallWhiteBtn = ({ text, onClick }: IBtnText) => {
  return (
    <SmWhite onClick={onClick} type="button">
      <SmWhiteText>{text}</SmWhiteText>
    </SmWhite>
  );
};

//
//
//

// 미팅 삭제하고 나가기 버튼

const DeleteAndRunWrapper = styled.button`
  display: inline-flex;
  align-items: flex-start;
  gap: 10px;
`;

const DeleteAndRunText = styled.span`
  color: var(--grey-grey-500, #767170);
  text-align: center;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: -0.12px;
`;

export const DeleteAndRunBtn = ({ text }: IBtnText) => {
  return (
    <DeleteAndRunWrapper>
      <DeleteAndRunText>{text}</DeleteAndRunText>
    </DeleteAndRunWrapper>
  );
};

//
//
//

// 바텀 버턴

const BotBtnWrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 16px 16px 24px 16px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  background: var(--grey-scale-coolgrey-00, #fff);
  box-shadow: 0px -2px 4px 0px rgba(18, 22, 26, 0.04);
`;

const BotLongOrangeBtn = styled.button`
  display: flex;
  padding: 16px 12px;
  justify-content: center;
  align-items: center;
  align-self: stretch;

  border-radius: 8px;
  background: var(--gd, linear-gradient(91deg, #ffbf7b 0%, #ff7152 100%));
`;

const BotLongOrangeText = styled.span`
  color: var(--grey-grey-00, #fff);
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.224px;
`;

export const BottomOrangeBtn = ({ text }: IBtnText) => {
  return (
    <BotBtnWrapper>
      <BotLongOrangeBtn>
        <BotLongOrangeText>{text}</BotLongOrangeText>
      </BotLongOrangeBtn>
    </BotBtnWrapper>
  );
};

// 다이얼로그
export const DialogContainer = styled.div`
  z-index: 30;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  width: 352px;
  padding: 24px 16px 16px 16px;
  flex-direction: column;
  align-items: center;
  gap: 16px;

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

export const DialogRightBtn = styled.button`
  display: flex;
  padding: 16px 12px;
  justify-content: center;
  align-items: center;
  flex: 1 0 0;

  border-radius: 8px;
  background: var(--gd, linear-gradient(91deg, #ffbf7b 0%, #ff7152 100%));
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
  contents: string;
  left?: string;
  right?: string;
  onLeftClick?: () => void;
  onRightClick?: () => void;
  disable?: boolean;
}

export const Dialog = ({
  title,
  contents,
  left,
  right,
  onLeftClick,
  onRightClick,
}: IDialog) => {
  return (
    <DialogContainer>
      <DialogTitle>{title}</DialogTitle>
      <DialogContents>{contents}</DialogContents>
      <DialogBtnFrame>
        <DialogLeftBtn onClick={onLeftClick}>
          <DialogLeftText>{left}</DialogLeftText>
        </DialogLeftBtn>
        <DialogRightBtn onClick={onRightClick}>
          <DialogRightText>{right}</DialogRightText>
        </DialogRightBtn>
      </DialogBtnFrame>
    </DialogContainer>
  );
};

export const DialogOneBtn = ({
  title,
  contents,
  right,
  onRightClick,
}: IDialog) => {
  return (
    <DialogContainer>
      <DialogTitle>{title}</DialogTitle>
      <DialogContents>{contents}</DialogContents>
      <DialogBtnFrame>
        <DialogRightBtn onClick={onRightClick}>
          <DialogRightText>{right}</DialogRightText>
        </DialogRightBtn>
      </DialogBtnFrame>
    </DialogContainer>
  );
};

// 스낵바
const SnackBarWrapper = styled.button`
  position: fixed;
  width: 30%;
  max-width: 36rem;
  left: 50%;
  transform: translate(-50%, -50%); // 정확한 중앙으로 이동
  bottom: 100px;
  display: flex;
  padding: 16px;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  background: var(--scrim-scrim-1, rgba(18, 22, 26, 0.72));
`;

const SnackBarText = styled.span`
  flex: 1 0 0;
  color: var(--grey-scale-coolgrey-00, #fff);
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  line-height: 14px;
  letter-spacing: -0.12px;
`;

export const SnackBar = ({ text }: IBtnText) => {
  return (
    <SnackBarWrapper>
      <SnackBarText>{text}</SnackBarText>
    </SnackBarWrapper>
  );
};

import { Overlay } from "../sign-up/styles/detailComponents";
import { DialogOneBtn } from "./styles/Button";

interface OneBtnDialogProps {
  isOpen: boolean;
  title: string;
  contents?: string | undefined;
  onBtnClick: () => void;
  buttonText: string;
}

const OneBtnDialog: React.FC<OneBtnDialogProps> = ({
  isOpen,
  title,
  contents,
  onBtnClick,
  buttonText,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <Overlay>
      <DialogOneBtn
        title={title}
        contents={contents}
        onRightClick={onBtnClick}
        right={buttonText}
      />
    </Overlay>
  );
};

export default OneBtnDialog;

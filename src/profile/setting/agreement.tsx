import { useNavigate } from "react-router-dom";
import { TopBar } from "../../components/TopBar";
import { ArrowbackIcon } from "../../components/styles/Icons";
import {
  AgreementScreen,
  CheckText,
  ClosePopUpButtonFrame,
  EachCheckBoxFrame,
  ViewContents,
  ViewContentsButton,
  ViewContentsPopUpFrame,
  ViewContentsTitle,
} from "../../sign-up/styles/agreementComponents";
import { useState } from "react";
import agreementData from "../../sign-up/components/agreementData.json";
import { LongOrangeBtn } from "../../components/styles/Button";
import { Overlay } from "../../sign-up/styles/detailComponents";

export default function Agreement() {
  const navigate = useNavigate();

  const [showPopUp, setShowPopUp] = useState<boolean>(false);
  const [selectedAgreementId, setSelectedAgreementId] = useState<number>(0);
  const onOpenPopUp = (id: number) => {
    setSelectedAgreementId(id);
    setShowPopUp(true);
  };

  const getAgreementDataById = (id: number) => {
    const selectedAgreement = agreementData.find(
      (agreement) => agreement.id === id
    );
    return selectedAgreement || null;
  };

  const onClosePopUp = () => {
    setShowPopUp(false);
  };
  return (
    <>
      <TopBar
        title="개인정보 처리방침 및 서비스 이용 약관"
        leftIcon={<ArrowbackIcon onClick={() => navigate(-1)} />}
      />
      <AgreementScreen>
        <EachCheckBoxFrame>
          <CheckText>개인정보 처리방침</CheckText>

          <ViewContentsButton onClick={() => onOpenPopUp(0)}>
            내용보기
          </ViewContentsButton>
        </EachCheckBoxFrame>
        <EachCheckBoxFrame>
          <CheckText>서비스 이용 약관</CheckText>

          <ViewContentsButton onClick={() => onOpenPopUp(1)}>
            내용보기
          </ViewContentsButton>
        </EachCheckBoxFrame>
      </AgreementScreen>
      {showPopUp && (
        <Overlay onClick={onClosePopUp}>
          <ViewContentsPopUpFrame>
            <ViewContentsTitle>
              {getAgreementDataById(selectedAgreementId)?.title}
            </ViewContentsTitle>
            <ViewContents>
              {getAgreementDataById(selectedAgreementId)?.content}
            </ViewContents>
            <ClosePopUpButtonFrame>
              <LongOrangeBtn text="닫기" onClick={onClosePopUp} />
            </ClosePopUpButtonFrame>
          </ViewContentsPopUpFrame>
        </Overlay>
      )}
    </>
  );
}

import { useNavigate } from "react-router-dom";
import { TopBar } from "../../components/TopBar";
import { ArrowbackIcon } from "../../components/styles/Icons";
import {
  AgreementScreen,
  AgreementTitle,
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
        title="서비스 이용약관"
        leftIcon={<ArrowbackIcon onClick={() => navigate(-1)} />}
      />
      <AgreementScreen>
        <div className="mb-8">
          <AgreementTitle>
            서비스 이용 약관 및 개인정보 처리 정책
          </AgreementTitle>
        </div>
        <EachCheckBoxFrame>
          <CheckText>목적 및 정의</CheckText>

          <ViewContentsButton onClick={() => onOpenPopUp(0)}>
            내용보기
          </ViewContentsButton>
        </EachCheckBoxFrame>
        <EachCheckBoxFrame>
          <CheckText>개인정보 수집 및 이용에 대한 동의</CheckText>

          <ViewContentsButton onClick={() => onOpenPopUp(1)}>
            내용보기
          </ViewContentsButton>
        </EachCheckBoxFrame>
        <EachCheckBoxFrame>
          <CheckText>개인정보의 보호 및 책임 면제</CheckText>

          <ViewContentsButton onClick={() => onOpenPopUp(2)}>
            내용보기
          </ViewContentsButton>
        </EachCheckBoxFrame>
        <EachCheckBoxFrame>
          <CheckText>개인정보의 제공 및 공유</CheckText>

          <ViewContentsButton onClick={() => onOpenPopUp(3)}>
            내용보기
          </ViewContentsButton>
        </EachCheckBoxFrame>
        <EachCheckBoxFrame>
          <CheckText>서비스 이용 책임의 한계</CheckText>

          <ViewContentsButton onClick={() => onOpenPopUp(4)}>
            내용보기
          </ViewContentsButton>
        </EachCheckBoxFrame>
        <EachCheckBoxFrame>
          <CheckText>약관의 변경</CheckText>

          <ViewContentsButton onClick={() => onOpenPopUp(5)}>
            내용보기
          </ViewContentsButton>
        </EachCheckBoxFrame>
      </AgreementScreen>
      {showPopUp && (
        <Overlay>
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

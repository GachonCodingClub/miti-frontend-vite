import { useEffect, useState } from "react";
import { GrayLine } from "../meeting-chat-room/styles/MeetingChatRoomComponents";
import {
  AgreementScreen,
  AgreementTitle,
  AllCheckFrame,
  CheckBox,
  CheckText,
  EachCheckBoxFrame,
  ViewContentsButton,
  NextButtonFrame,
  NextButton,
  CheckBoxContainer,
  ViewContentsPopUpFrame,
  ViewContentsTitle,
  ViewContents,
  ClosePopUpButtonFrame,
} from "./components/agreementComponents";
import { SIGNUP_ROUTES } from "../routes";
import { Overlay } from "./components/detailComponents";
import { LongOrangeBtn } from "../components/styles/Button";
import agreementData from "../sign-up/components/agreementData.json";
import { TopBar } from "../components/TopBar";
import { ArrowbackIcon } from "../components/styles/Icons";
import { useNavigate } from "react-router-dom";

export default function SignUpAgreement() {
  // 해당 checkBox가 가지고 있는 name을 넣어주기 위한 string배열 state
  const [checkList, setCheckList] = useState<string[]>([]);
  // 필수 항목을 전부 체크해야만 보이는 boolean값을 가진 state
  const [showButton, setShowButton] = useState<boolean>(false);

  // 모두 check하는 함수
  // 이벤트 파라미터를 받고, 이걸 체크하면 모든 checkBox의 name을 배열에 넣음
  const checkAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.checked
      ? setCheckList(["first", "second", "third"])
      : setCheckList([]); // 이건 다 없애기
  };

  // 각각 check하는 함수
  // 이벤트 파라미터를 받고, 체크하면 checkBox의 name을 배열에 넣음
  // 새로운 checkList를 반환하는데 이를 deepCopy라고 함
  const check = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.checked
      ? setCheckList([...checkList, e.target.name])
      : setCheckList(checkList.filter((choice) => choice !== e.target.name));
    // 체크가 해제 되면 filter 메소드를 사용해 담겼던 name을 찾아 배열에서 제거
  };

  /* state는 비동기로 동작하기 때문에 이벤트핸들러 안에서 setState를 
  호출하게 되면 state값이 즉각적으로 바뀌지 않기 때문에 useEffect안에서 작동되게 함 */
  useEffect(() => {
    setShowButton(
      checkList.includes("first") &&
        checkList.includes("second") &&
        checkList.includes("third")
    );
  }, [checkList]);

  // 약관 팝업
  const [showPopUp, setShowPopUp] = useState<boolean>(false);
  // id 선택
  const [selectedAgreementId, setSelectedAgreementId] = useState<number>(0);

  // 팝업창 열기
  const onOpenPopUp = (id: number) => {
    setSelectedAgreementId(id);
    setShowPopUp(true);
  };

  const getAgreementDataById = (id: number) => {
    // agreementData 배열에서 find 메서드를 사용하여 주어진 id와 일치하는  첫 번째  객체를 찾음
    const selectedAgreement = agreementData.find(
      (agreement) => agreement.id === id
    );
    // 만약 일치하는 객체가 있다면 해당 객체를 반환하고,
    // 일치하는 객체가 없다면 (undefined인 경우) null을 반환함
    return selectedAgreement || null;
  };

  // 팝업창 닫기
  const onClosePopUp = () => {
    setShowPopUp(false);
  };

  const navigate = useNavigate();
  const onNextButtonClick = () => {
    navigate(`${SIGNUP_ROUTES.SIGN_UP}`);
  };
  return (
    <>
      <TopBar leftIcon={<ArrowbackIcon onClick={() => navigate(-1)} />} />
      <AgreementScreen>
        <AgreementTitle>다음 약관에 동의해주세요</AgreementTitle>
        {/* 전체 동의 체크박스 */}
        <AllCheckFrame>
          <CheckBox
            type="checkbox"
            name="all"
            onChange={checkAll}
            checked={checkList.length === 3 ? true : false}
          />
          <CheckText>이용약관 전체동의</CheckText>
        </AllCheckFrame>
        <GrayLine />
        {/* 각각의 체크박스와 내용보기 버튼 */}
        <CheckBoxContainer>
          <EachCheckBoxFrame>
            <div className="flex items-center">
              <CheckBox
                type="checkbox"
                name="first"
                onChange={check}
                checked={checkList.includes("first") ? true : false}
              />

              <CheckText>개인정보 수집 및 이용에 대한 동의 (필수)</CheckText>
            </div>
            <ViewContentsButton onClick={() => onOpenPopUp(1)}>
              내용보기
            </ViewContentsButton>
          </EachCheckBoxFrame>
          <EachCheckBoxFrame>
            <div className="flex items-center">
              <CheckBox
                type="checkbox"
                name="second"
                onChange={check}
                checked={checkList.includes("second") ? true : false}
              />
              <CheckText>개인정보의 보호 및 책임 면제 (필수)</CheckText>
            </div>
            <ViewContentsButton onClick={() => onOpenPopUp(2)}>
              내용보기
            </ViewContentsButton>
          </EachCheckBoxFrame>
          <EachCheckBoxFrame>
            <div className="flex items-center">
              <CheckBox
                type="checkbox"
                name="third"
                onChange={check}
                checked={checkList.includes("third") ? true : false}
              />
              <CheckText>개인정보의 제공 및 공유 (필수)</CheckText>
            </div>
            <ViewContentsButton onClick={() => onOpenPopUp(3)}>
              내용보기
            </ViewContentsButton>
          </EachCheckBoxFrame>
        </CheckBoxContainer>
      </AgreementScreen>
      {/* 약관 내용 팝업 */}
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
      <NextButtonFrame>
        <NextButton onClick={onNextButtonClick} state={showButton}>
          다음
        </NextButton>
      </NextButtonFrame>
    </>
  );
}

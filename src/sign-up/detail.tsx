import { CautionMessage } from "../components/styles/Input";
import { useState } from "react";
import {
  LeftSelectButton,
  RightSelectButton,
} from "../components/styles/SelectButton";
import {
  CharCount,
  DetailFrame,
  DetailSetScreen,
  DetailTitle,
  IntroduceFrame,
  SelectBtnFrame,
  SelectBtnText,
  SelectButtonContainer,
} from "./styles/detailComponents";
import { FixedButtonBox, LongOrangeBtn } from "../components/styles/Button";
import { useRecoilState } from "recoil";
import { getApi } from "../api/getApi";
import { useQuery } from "react-query";
import { userEmailAtom, userPasswordAtom } from "../atoms";
import {
  MyInputBox,
  MyInputBoxButton,
  MyInputBoxSVG,
} from "../components/MyInputBox";
import { ArrowbackIcon, ArrowdropIcon } from "../components/styles/Icons";

import NickNameCheckModule from "./components/nicknameCheck";
import { ROUTES } from "../routes";
import { TopBar } from "../components/TopBar";
import React from "react";
import { validateProfile } from "./components/validateProfile";
import { fetchSignUp } from "./components/fetchSignUp";
import { useNavigate } from "react-router-dom";
import { MyHeightSheet } from "./components/HeightSheet";
import { MyWeightSheet } from "./components/WeightSheet";
import { rangeToAlphabet } from "../components/rangeToAlphabet";
import { Dialog } from "../components/Dialog";

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function SingUpDetail() {
  const navigate = useNavigate();
  // 닉네임
  const [userNickName, setUserNickName] = useState(""); // 입력받은 닉
  const [nickNameError, setNickNameError] = useState(""); // 닉네임 오류
  const [isCheckNicknameButtonDisabled, setIsCheckNicknameButtonDisabled] =
    useState(true); // 닉네임 버튼 활/비활

  // 닉네임 중복확인 버튼
  const onSubmitNickName = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newNickName = e.target.value;

    // 이모지를 제거하는 정규 표현식
    const emojiRegex = /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu;
    newNickName = newNickName.replace(emojiRegex, "");

    setUserNickName(newNickName);

    if (newNickName === "") {
      setIsCheckNicknameButtonDisabled(true);
    } else {
      setIsCheckNicknameButtonDisabled(false);
    }
  };

  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [possibleNickname, setPossibleNickname] = useState(false);
  const checkOverlapPossible = () => {
    setPossibleNickname(false);
    setNickNameError("");
    setIsInputDisabled(true); // input을 비활성화 상태로 설정
  };

  // 닉네임 중복확인 API
  const getNickName = async () => {
    try {
      const response = await getApi({
        link: `/auth/check/nickname?nickname=${userNickName}`,
      });
      return response; // API 호출 결과를 반환
    } catch (error) {
      console.error("닉네임 중복 확인 중 에러 발생", error);
      throw error; // 에러를 던져서 useQuery가 에러 상태를 인식할 수 있도록 함
    }
  };

  // 닉네임 중복검사 다이얼로그
  const [overlapNickname, setOverlapNickname] = useState(false);
  const checkOverlap = () => {
    setOverlapNickname(false);
  };

  interface Data {
    status: number;
  }

  const { data }: { data?: Data } = useQuery(
    ["nickname", userNickName],
    getNickName
  );
  // 닉네임 중복확인 버튼
  const onCheckNicknameBtn = () => {
    if (!isCheckNicknameButtonDisabled) {
      if (data?.status === 409) {
        setOverlapNickname(true);
        setSubscription(false);
        setNickNameError("닉네임을 확인해 주세요");
      } else {
        setPossibleNickname(true);
      }
    }
  };

  // 자기소개
  const [userIntroduce, setUserIntroduce] = useState("");
  const [introduceError, setIntroduceError] = useState("");
  const [charCount, setCharCount] = useState(0);

  const MAX_INTRODUCE_LENGTH = 60; // 최대 글자 수 설정

  const onSubmitIntroduce = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIntroduce = e.target.value;
    const currentCharCount = newIntroduce.length;

    if (currentCharCount > MAX_INTRODUCE_LENGTH) {
      setIntroduceError(
        `자기소개는 ${MAX_INTRODUCE_LENGTH}자 이하로 입력해주세요`
      );
    } else {
      setIntroduceError("");
      setUserIntroduce(newIntroduce);
      setCharCount(currentCharCount);
    }
  };

  // 성별
  const [userGender, setUserGender] = useState("");
  const [genderError, setGenderError] = useState("");

  // 생년월일
  const [userBirth, setUserBirth] = useState("");
  const [birthError, setBirthError] = useState("");

  const onSubmitBirth = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBirth = e.target.value;
    const todayYYYYMMDD = getCurrentDate();
    if (newBirth > todayYYYYMMDD) {
      setBirthError("정확한 생년월일을 입력해주세요");
    } else {
      // 입력이 유효한 경우
      setBirthError("");
      setUserBirth(newBirth);
    }
  };

  // 키(cm)
  const [userHeight, setUserHeight] = useState("");
  const [heightError, setHeightError] = useState("");
  const [showHeightSheet, setShowHeightSheet] = useState(false);

  const onSubmitHeight = () => {
    setShowHeightSheet(true);
  };

  // 사용자가 누른거
  const onHeightSelected = (selectedHeight: string) => {
    setUserHeight(selectedHeight);
    setShowHeightSheet(false); // 선택 후 Sheet를 숨김
  };

  // 몸무게(kg)
  const [userWeight, setUserWeight] = useState("");
  const [weightError, setWeightError] = useState("");
  const [showWeightSheet, setShowWeightSheet] = useState(false);

  const onSubmitWeight = () => {
    setShowWeightSheet(true);
  };

  // 시트 사용자가 누른거
  const onWeightSelected = (selectedWeight: string) => {
    setUserWeight(selectedWeight);
    setShowWeightSheet(false); // 선택 후 Sheet를 숨김
  };

  // X 버튼
  const XButtonClick = () => {
    setShowHeightSheet(false);
    setShowWeightSheet(false);
  };

  // 리코일
  const userEmailState = useRecoilState(userEmailAtom);
  const userEmail = userEmailState[0];
  const userPasswordState = useRecoilState(userPasswordAtom);
  const userPassword = userPasswordState[0];

  // 가입 완료 스낵바
  const [subscription, setSubscription] = useState(false);

  const onSubscriptionClick = () => {
    navigate(`${ROUTES.SIGN_IN}`);
  };

  // 마지막 가입 완료 버튼
  const completeButton = () => {
    const errors = validateProfile(
      userNickName,
      userIntroduce,
      userGender,
      userBirth,
      userHeight,
      userWeight
    );

    setNickNameError(errors.nickNameError || "");
    setIntroduceError(errors.introduceError || "");
    setGenderError(errors.genderError || "");
    setBirthError(errors.birthError || "");
    setHeightError(errors.heightError || "");
    setWeightError(errors.weightError || "");

    // 에러 검사
    if (Object.values(errors).some((error) => error !== "")) {
      setSubscription(false);
    } else {
      const heightToSend = rangeToAlphabet(userHeight, "height");
      const weightToSend = rangeToAlphabet(userWeight, "weight");

      fetchSignUp(
        userNickName,
        userGender,
        userBirth,
        heightToSend,
        weightToSend,
        userEmail,
        userPassword,
        userIntroduce
      )
        .then(() => setSubscription(true))
        .catch(() => setSubscription(false));
    }
  };

  return (
    <>
      <TopBar leftIcon={<ArrowbackIcon onClick={() => navigate(-1)} />} />
      <DetailSetScreen>
        <DetailTitle>
          미티의 친구를 만나기까지 <br />
          얼마 남지 않았어요!
        </DetailTitle>
        <DetailFrame>
          {/* 닉네임 */}
          <MyInputBoxButton
            placeholder="닉네임 입력(최대 8글자)"
            label="닉네임"
            type="text"
            value={userNickName}
            onChange={onSubmitNickName}
            btnText="중복확인"
            onClick={onCheckNicknameBtn}
            disable={isInputDisabled}
            error={nickNameError}
            maxLength={8}
          />
          {/* 닉네임 확인 */}
          <NickNameCheckModule
            overlapNickname={overlapNickname}
            setOverlapNickname={setOverlapNickname}
            possibleNickname={possibleNickname}
            setPossibleNickname={setPossibleNickname}
            isInputDisabled={isInputDisabled}
            checkOverlap={checkOverlap}
            checkOverlapPossible={checkOverlapPossible}
          />
          <IntroduceFrame>
            <MyInputBox
              placeholder="자기소개 또는 인스타 주소를 적어주세요"
              label="한줄소개"
              type="text"
              value={userIntroduce}
              onChange={onSubmitIntroduce}
              error={introduceError}
            />
            {charCount >= 0 && (
              <CharCount>
                {charCount} / {MAX_INTRODUCE_LENGTH}
              </CharCount>
            )}
          </IntroduceFrame>

          {/* 성별 선택 */}
          <SelectBtnFrame>
            <SelectBtnText>성별</SelectBtnText>
            <SelectButtonContainer>
              <LeftSelectButton
                text="여자"
                active={userGender === "FEMALE"}
                onClick={() => setUserGender("FEMALE")}
              />
              <RightSelectButton
                text="남자"
                active={userGender === "MALE"}
                onClick={() => setUserGender("MALE")}
              />
            </SelectButtonContainer>
            {genderError && <CautionMessage>{genderError}</CautionMessage>}
          </SelectBtnFrame>

          {/* 생년월일 */}
          <MyInputBox
            placeholder="19990101"
            label="생년월일"
            type="number"
            value={userBirth}
            onChange={onSubmitBirth}
            error={birthError}
          />

          {/* 키 */}
          <MyInputBoxSVG
            placeholder="버튼을 눌러 키를 선택해주세요"
            label="키(cm)"
            type="text"
            onClick={onSubmitHeight}
            value={userHeight}
            onChange={() => {}}
            error={heightError}
            svg={<ArrowdropIcon />}
            showSheet={true}
          />

          {/* 몸무게 */}
          <MyInputBoxSVG
            placeholder="버튼을 눌러 몸무게를 선택해주세요"
            label="몸무게(kg)"
            type="text"
            onClick={onSubmitWeight}
            value={userWeight}
            onChange={() => {}}
            error={weightError}
            svg={<ArrowdropIcon />}
            showSheet={true}
          />
        </DetailFrame>

        {/* 키 선택시트 */}
        <MyHeightSheet
          show={showHeightSheet}
          onClose={XButtonClick}
          onSelected={onHeightSelected}
          title="키(cm) 선택"
          rangeStart={120}
          rangeEnd={130}
        />
        {/* 몸무게 선택시트 */}
        <MyWeightSheet
          show={showWeightSheet}
          onClose={XButtonClick}
          onSelected={onWeightSelected}
          title="몸무게(kg) 선택"
          rangeStart={30}
          rangeEnd={40}
        />

        {/* 가입 성공 */}
        {subscription && (
          <Dialog
            isOneBtn
            title="가입 성공!"
            onRightClick={onSubscriptionClick}
            right="로그인 화면으로 이동"
          />
        )}
      </DetailSetScreen>
      <FixedButtonBox>
        <LongOrangeBtn text="가입 완료" onClick={completeButton} />
      </FixedButtonBox>
    </>
  );
}

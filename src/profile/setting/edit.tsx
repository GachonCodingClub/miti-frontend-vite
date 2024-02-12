import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { fetchProfile } from "../components/fetchProfile";
import { validateProfile } from "../components/validateProfile";
import { useNavigate } from "react-router-dom";
import { getApi } from "../../api/getApi";
import {
  DialogOneBtn,
  FixedButtonBox,
  LongOrangeBtn,
} from "../../components/Button";
import { ArrowbackIcon, ArrowdropIcon } from "../../components/Icons";
import {
  MyInputBoxButton,
  MyInputBox,
  MyInputBoxSVG,
} from "../../components/MyInputBox";
import { TopBar } from "../../components/TopBar";
import { ROUTES } from "../../routes";
import { MyHeightWeightSheet } from "../../sign-up/components/HeightWeightSheet";
import {
  DetailSetScreen,
  DetailTitle,
  DetailFrame,
  IntroduceFrame,
  CharCount,
  Overlay,
} from "../../sign-up/components/detailComponents";
import NickNameCheckModule from "../../sign-up/components/nicknameCheck";

export default function EditProfile() {
  const navigate = useNavigate(); // useNavigate 사용
  // 먼저 jwt토큰 정보
  const [token, setToken] = useState(""); // 추가: 토큰 상태 추가
  useEffect(() => {
    // 컴포넌트가 마운트될 때 localStorage에서 토큰을 가져와 상태에 설정
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const [editError, setEditError] = useState(false);

  const getUserProfile = async () => {
    const response = await getApi({ link: `/users/profile/my` });
    const data = await response.json();
    return data;
  };

  const { data: profile } = useQuery(["profile"], getUserProfile);

  // 수정 완료 스낵바
  const [subscription, setSubscription] = useState(false);

  // 닉네임
  const [userNickName, setUserNickName] = useState(profile?.nickname); // 입력받은 닉
  const [nickNameError, setNickNameError] = useState(""); // 닉네임 오류
  const [isCheckNicknameButtonDisabled, setIsCheckNicknameButtonDisabled] =
    useState(true); // 닉네임 버튼 활/비활

  // 닉네임 중복확인 버튼
  const onSubmitNickName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNickName = e.target.value;
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
  const getNickName = () =>
    // 파싱 로직 추가
    getApi({
      link: `/auth/check/nickname?nickname=${userNickName}`,
    });

  // 닉네임 중복검사 다이얼로그
  const [overlapNickname, setOverlapNickname] = useState(false);
  const checkOverlap = () => {
    setOverlapNickname(false);
  };
  const { data } = useQuery(["nickname", userNickName], getNickName);

  // 닉네임 중복확인 버튼
  const onCheckNicknameBtn = () => {
    if (!isCheckNicknameButtonDisabled) {
      if (data?.status === 409) {
        setOverlapNickname(true);
        setSubscription(false);
        setNickNameError("닉네임을 확인해 주세요.");
      } else {
        setPossibleNickname(true);
      }
    }
  };

  // 자기소개
  const [userIntroduce, setUserIntroduce] = useState(profile?.description);
  const [introduceError, setIntroduceError] = useState("");
  const [charCount, setCharCount] = useState(profile?.description?.length);

  const MAX_INTRODUCE_LENGTH = 60; // 최대 글자 수 설정

  const onSubmitIntroduce = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIntroduce = e.target.value;
    const currentCharCount = newIntroduce.length;

    if (currentCharCount > MAX_INTRODUCE_LENGTH) {
      setIntroduceError(
        `자기소개는 ${MAX_INTRODUCE_LENGTH}자 이하로 입력해주세요.`
      );
    } else {
      setIntroduceError("");
      setUserIntroduce(newIntroduce);
      setCharCount(currentCharCount);
    }
  };

  // 키(cm)
  const [userHeight, setUserHeight] = useState(profile?.height);
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
  const [userWeight, setUserWeight] = useState(profile?.weight);
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

  // 프로필로 이동
  const onSubscriptionClick = () => {
    navigate(`${ROUTES.PROFILE}`);
  };

  // 마지막 수정 완료 버튼
  const completeButton = () => {
    const errors = validateProfile(
      userNickName,
      userIntroduce,
      userHeight,
      userWeight
    );

    setNickNameError(errors.nickNameError || "");
    setIntroduceError(errors.introduceError || "");
    setHeightError(errors.heightError || "");
    setWeightError(errors.weightError || "");

    // 에러 검사
    if (Object.values(errors).some((error) => error !== "")) {
      setSubscription(false);
    } else {
      // Fetch
      fetchProfile(
        token,
        userNickName,
        userIntroduce,
        userHeight,
        userWeight,
        setSubscription,
        setEditError
      )
        .then((success) => setSubscription(success))
        .catch(() => setSubscription(false));
    }
  };

  return (
    <>
      <TopBar leftIcon={<ArrowbackIcon onClick={() => navigate(-1)} />} />
      <DetailSetScreen>
        <DetailTitle>프로필 수정</DetailTitle>
        <DetailFrame>
          {/* 닉네임 수정 */}
          <MyInputBoxButton
            placeholder="닉네임 입력"
            label="닉네임"
            type="text"
            value={userNickName}
            onChange={onSubmitNickName}
            btnText="중복확인"
            onClick={onCheckNicknameBtn}
            disable={isInputDisabled}
            error={nickNameError}
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
              placeholder="자기소개를 적어주세요."
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
          {/* 키 */}
          <MyInputBoxSVG
            placeholder="키 선택(10단위)"
            label="키(cm)"
            type="text"
            onClick={onSubmitHeight}
            value={userHeight}
            onChange={() => {}}
            error={heightError}
            svg={<ArrowdropIcon />}
          />

          {/* 몸무게 */}
          <MyInputBoxSVG
            placeholder="몸무게 선택(10단위)"
            label="몸무게(kg)"
            type="text"
            onClick={onSubmitWeight}
            value={userWeight}
            onChange={() => {}}
            error={weightError}
            svg={<ArrowdropIcon />}
          />
        </DetailFrame>
        {/* 키 선택시트 */}
        <MyHeightWeightSheet
          show={showHeightSheet}
          onClose={XButtonClick}
          onSelected={onHeightSelected}
          title="키(cm) 선택"
          rangeStart={120}
          rangeEnd={130}
        />
        {/* 몸무게 선택시트 */}
        <MyHeightWeightSheet
          show={showWeightSheet}
          onClose={XButtonClick}
          onSelected={onWeightSelected}
          title="몸무게(kg) 선택"
          rangeStart={30}
          rangeEnd={40}
        />

        {/* 수정 완료 */}
        {subscription && (
          <Overlay style={{ zIndex: "30" }}>
            <DialogOneBtn
              title="수정 완료!"
              contents=""
              onRightClick={onSubscriptionClick}
              right="프로필 화면으로 이동"
            />
          </Overlay>
        )}

        {editError && (
          <Overlay style={{ zIndex: "30" }}>
            <DialogOneBtn
              title="프로필 수정 실패"
              contents="입력한 정보를 확인해주세요."
              onRightClick={() => {
                setEditError(false);
              }}
              right="닫기"
            />
          </Overlay>
        )}
      </DetailSetScreen>
      <FixedButtonBox>
        <LongOrangeBtn text="수정하기" onClick={completeButton} />
      </FixedButtonBox>
    </>
  );
}

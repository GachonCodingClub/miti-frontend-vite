export const validateProfile = (
  userNickName: string,
  userIntroduce: string,
  userHeight: string,
  userWeight: string
) => {
  const errors: Record<string, string> = {};

  // 닉네임 검증
  if (userNickName === "") {
    errors.nickNameError = "닉네임을 확인해 주세요.";
  }

  // 자기소개 검증
  if (userIntroduce === "") {
    errors.introduceError = "자기소개를 입력해 주세요.";
  }

  // 키 검증
  if (userHeight === "") {
    errors.heightError = "키(cm)를 선택해 주세요.";
  }

  // 몸무게 검증
  if (userWeight === "") {
    errors.weightError = "몸무게(kg)를 선택해 주세요.";
  }

  return errors;
};

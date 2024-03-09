function formatBirthday(input: string) {
  if (input.length === 8) {
    const year = input.substring(0, 4);
    const month = input.substring(4, 6);
    const day = input.substring(6, 8);

    return `${year}-${month}-${day}`;
  } else {
    // 잘못된 입력 형식인 경우 또는 입력이 8글자가 아닌 경우
    return "Invalid Format";
  }
}

export const fetchSignUp = async (
  userNickName: string,
  userGender: string,
  userBirth: string,
  userHeight: string,
  userWeight: string,
  userEmail: string,
  userPassword: string,
  userIntroduce: string
) => {
  const SignUpUrl = `${import.meta.env.VITE_BASE_URL}/auth/sign-up`;

  const headers = {
    "Content-Type": "application/json",
  };

  const bodyData = JSON.stringify({
    nickname: userNickName,
    gender: userGender,
    birthDate: formatBirthday(userBirth),
    height: userHeight,
    weight: userWeight,
    userId: userEmail,
    password: userPassword,
    description: userIntroduce,
  });

  try {
    const response = await fetch(SignUpUrl, {
      method: "POST",
      body: bodyData,
      mode: "cors",
      headers: headers,
    });
    if (!response.ok) {
      console.error(`API 오류: ${response.status} - ${response.statusText}`);
      if (response.status === 500) {
        alert("닉네임을 확인해주세요.");
      } else if (response.status === 400) {
        alert("생년월일을 확인해주세요.");
      } else {
        alert(`오류가 발생했습니다: ${response.status}`);
      }
      return false;
    }
    const data = await response.json();
    return data === true;
  } catch (error) {
    console.error(error);
    alert("서버 오류가 발생했습니다. 나중에 다시 시도해주세요.");
    return false;
  }
};

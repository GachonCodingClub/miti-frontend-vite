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
  console.log(userHeight, userWeight);
  console.log(formatBirthday(userBirth));

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
    userName: "A",
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
      return false;
    }
    const data = await response.json();
    console.log(data);
    return data === true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

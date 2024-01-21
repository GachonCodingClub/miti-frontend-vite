export const fetchProfile = async (
  token: string,
  userNickName: string,
  userIntroduce: string,
  userHeight: string,
  userWeight: string
) => {
  const SignUpUrl = `${import.meta.env.VITE_BASE_URL}/users/profile/my`;
  const bodyData = {
    nickname: userNickName,
    height: "A", // 임시
    weight: "B",
    description: userIntroduce,
  };
  console.log(userHeight, userWeight);
  // 헤더에 Authorization을 추가하여 토큰을 전송
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`, // 토큰을 헤더에 추가
  };

  try {
    const response = await fetch(SignUpUrl, {
      method: "PATCH",
      body: JSON.stringify(bodyData),
      mode: "cors",
      headers: headers,
    });

    if (!response.ok) {
      console.error(`API 오류: ${response.status} - ${response.statusText}`);
      const errorData = await response.json();
      console.error("상세 오류 정보:", errorData);
      return false;
    }

    const data = await response.json();
    console.log("프로필 수정", data);
    return data === true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

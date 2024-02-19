import { getHeaders } from "../../components/getHeaders";

export const fetchProfile = async (
  token: string,
  userNickName: string,
  userIntroduce: string,
  userHeight: string,
  userWeight: string,
  _setSubscription: React.Dispatch<boolean>,
  setEditError: React.Dispatch<boolean>
) => {
  const SignUpUrl = `${import.meta.env.VITE_BASE_URL}/users/profile/my`;
  const bodyData = {
    nickname: userNickName,
    height: userHeight,
    weight: userWeight,
    description: userIntroduce,
  };
  console.log(userHeight, userWeight);
  const headers = getHeaders(token);

  try {
    const response = await fetch(SignUpUrl, {
      method: "PATCH",
      body: JSON.stringify(bodyData),
      mode: "cors",
      headers: headers,
    });

    if (!response.ok) {
      console.error(`API 오류: ${response.status} - ${response.statusText}`);
      if (response.status === 500) {
        setEditError(true);
      }
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

interface IfetchMeeting {
  isUpdate: boolean;
  id?: string | string[];
  headers: {
    "Content-Type": string;
    Authorization: string;
  };
  meetingData: {
    maxUsers?: number;
    nicknames?: string[];
    description: string;
    title: string;
    meetDate: string;
    meetPlace: string;
  };
}

export const fetchMeeting = async ({
  isUpdate,
  id,
  headers,
  meetingData,
}: IfetchMeeting) => {
  try {
    let url = `${import.meta.env.VITE_BASE_URL}/groups`;
    if (isUpdate) {
      url += `/${id}`;
    }

    const response = await fetch(url, {
      method: isUpdate ? "PATCH" : "POST",
      body: JSON.stringify(meetingData),
      mode: "cors",
      headers: headers,
    });

    if (!response.ok) {
      console.error(`API 오류: ${response.status} - ${response.statusText}`);
      throw new Error(`API 오류: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log("미팅 생성/업데이트 결과:", data);

    return data;
  } catch (error) {
    console.error("미팅 생성/업데이트 중 오류 발생:", error);
    throw error;
  }
};
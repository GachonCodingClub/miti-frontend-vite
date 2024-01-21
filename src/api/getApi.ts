interface IGetApi {
  link: string;
  isAuth?: boolean;
  token?: string | null;
  params?: { nickname: string } | undefined;
}

// <T> 뺐음
/** 'T'이(가) 선언은 되었지만 해당 값이 읽히지는 않았습니다.ts(6133)
'T' is defined but never used.eslint@typescript-eslint/no-unused-vars
⚠ Error(TS6133)  | 
T 이(가) 선언은 되었지만 해당 값이 읽히지는 않았습니다.
(type parameter) T in getApi<T>({ link }: IGetApi): Promise<Response> 이런 오류 발생함 */

export function getApi({ link }: IGetApi) {
  return fetch(`${import.meta.env.VITE_BASE_URL}${link}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
}

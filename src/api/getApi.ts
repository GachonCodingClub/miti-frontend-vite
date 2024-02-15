interface IGetApi {
  link: string;
  isAuth?: boolean;
  token?: string | null;
  params?: { nickname: string } | undefined;
}

export function getApi({ link }: IGetApi) {
  return fetch(`${import.meta.env.VITE_BASE_URL}${link}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
}

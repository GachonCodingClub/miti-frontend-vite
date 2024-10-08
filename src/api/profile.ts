import { useQuery } from "react-query";
import { getApi } from "./getApi";
import { IUser } from "../model/user";

export const getUserProfile = async () => {
  const response = await getApi({ link: `/users/me/profile` });
  const data = await response.json();
  return data;
};

export const useGetMyProfile = () => {
  return useQuery<IUser, Error>(["profile"], () => getUserProfile(), {
    staleTime: 1000 * 60 * 60 * 24 * 365 * 1, // 1년
    cacheTime: Infinity,
  });
};

import { useQuery } from "react-query";
import { getApi } from "./getApi";

export const getBlockList = async () => {
  const response = await getApi({ link: `/users/me/blocked-users` });
  const data = await response.json();
  return data;
};

export const useGetBlockList = () => {
  return useQuery(["blocklist"], () => getBlockList());
};

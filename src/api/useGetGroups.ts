import { useQuery } from "react-query";
import { IGroup } from "../model/group";
import { getApi } from "./getApi";

export const getGroups = async (id: string | undefined) => {
  const response = await getApi({ link: `/groups/${id}` });
  const data = await response.json();
  return data;
};

export const useGetGroups = (id: string | undefined) => {
  return useQuery<IGroup, Error>(["group", id], () => getGroups(id));
};

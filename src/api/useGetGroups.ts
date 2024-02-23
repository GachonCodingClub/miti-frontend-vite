import { useQuery } from "react-query";
import { IGroup } from "../model/group";
import { getApi } from "./getApi";

const useGetGroups = (id: string | undefined) => {
  return useQuery<IGroup, Error>(["group", id], () =>
    getApi({ link: `/groups/${id}` }).then((res) => res.json())
  );
};

export default useGetGroups;

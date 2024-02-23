import { useQuery } from "react-query";
import { IParties } from "../model/party";
import { getApi } from "./getApi";

const useGetParties = (id: string | undefined) => {
  return useQuery<IParties, Error>(["parties", id], () =>
    getApi({ link: `/groups/${id}/parties` }).then((res) => res.json())
  );
};

export default useGetParties;

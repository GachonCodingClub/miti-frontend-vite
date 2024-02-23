import { useQuery } from "react-query";
import { getApi } from "./getApi";
import { IUser } from "./../model/user";

const useGetMyProfile = () => {
  return useQuery<IUser, Error>(["profile"], () =>
    getApi({ link: `/users/profile/my` }).then((res) => res.json())
  );
};

export default useGetMyProfile;

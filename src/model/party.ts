import { IUser } from "./user";

export interface IParties {
  waitingParties: [
    {
      partyId: number;
      users: IUser[];
    }
  ];
  acceptedParties: [
    {
      partyId: number;
      users: IUser[];
      leader: IUser;
    }
  ];
}

import { IUser } from "./user";

export interface IParties {
  waitingParties: [
    {
      partyId: number;
      users: IUser[];
    }
  ];
  leaderUserSummaryDto: {
    userName: string;
    age: number;
    gender: string;
    height: string;
    weight: string;
  };
  acceptedParties: [
    {
      partyId: number;
      users: IUser[];
      leader: IUser;
    }
  ];
}

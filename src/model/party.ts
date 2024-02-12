import { IUser } from "./user";

export interface IParties {
  waitingParties: [
    {
      partyId: number;
      users: IUser[];
    }
  ];
  leaderUserSummaryDto: {
    description: string;
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

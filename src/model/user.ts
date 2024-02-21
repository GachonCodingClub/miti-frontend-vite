export interface IUser {
  nickname: string;
  description: string;
  userId: string;
  userName: string;
  gender: "MALE" | "FEMALE";
  height: "A" | "B";
  weight: "A" | "B";
  age: number;
}

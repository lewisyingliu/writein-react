import IElection from "./election.type";

export default interface IUser {
  id: number;
  username: string;
  password: string;
  userCode: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  roles?: Array<string>;
  election: IElection;
}

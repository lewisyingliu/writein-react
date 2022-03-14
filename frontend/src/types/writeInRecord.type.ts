import IElection from "./election.type";
import IUser from "./user.type";
export default interface IWriteInRecord {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  batchNumber: string;
  creatorName: string;
  electionTitle: string;
  recordCount:number;
  user: IUser;
  election: IElection;
}

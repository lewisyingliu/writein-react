import IElection from "./election.type";
export default interface IOffice {
  id: number;
  title: string;
  displayOrder: number;
  election: IElection;
}
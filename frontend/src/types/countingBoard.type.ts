import IElection from "./election.type";
export default interface ICountingBoard {
  id: number;
  title: string;
  displayOrder: number;
  election: IElection;
}

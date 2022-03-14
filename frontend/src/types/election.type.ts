export default interface IElection {
  id: number;
  title: string;
  code: string;
  electionDate: Date;
  defaultTag: boolean | undefined;
  status: string;
}

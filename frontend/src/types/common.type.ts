export interface DataProps {
  electionId: number;
  userId?: number;
  filterText: string;
  actionType?: string;
}

export interface RequestProps {
  filterText: string;
  page: number;
  rowsPerPage: number;
}

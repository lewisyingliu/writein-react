import http from "./http.common";
import IWriteInRecord from "../types/writeInRecord.type";

const getWriteInByElectionAndUser = (electionId: number, userId: number, params: any) => {
  return http.get(`/writeIns/elections/${electionId}/${userId}`, { params });
};

const create = (id: number, data: IWriteInRecord) => {
  return http.post(`/writeIns/elections/${id}`, data);
};

const update = (id: number, data: IWriteInRecord) => {
  return http.put(`/writeIns/${id}`, data);
};

const removeBatch = (data: number[]) => {
  return http.post(`/writeIns/deleteBatch`, data);
};

const exportedObject = {
  getWriteInByElectionAndUser,
  create,
  update,
  removeBatch,
};

export default exportedObject;

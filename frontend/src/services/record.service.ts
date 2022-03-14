import http from "./http.common";
import IWriteInRecord from "../types/writeInRecord.type";

const getWriteInByElection = (id: number, params: any) => {
  return http.get(`/records/elections/${id}`, { params });
};

const update = (id: number, data: IWriteInRecord) => {
  return http.put(`/records/${id}`, data);
};

const removeBatch = (data: number[]) => {
  return http.post(`/records/deleteBatch`, data);
};

const printPdf = (id: number) => {
  return http.get(`/records/printPdf/${id}`, { responseType: "blob" });
};

const exportToCSV = () => {
  return http.get(`/records/exportExcel`, { responseType: "blob" });
};

const exportedObject = {
  getWriteInByElection,
  update,
  removeBatch,
  printPdf,
  exportToCSV,
};

export default exportedObject;

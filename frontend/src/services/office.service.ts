import http from "./http.common";
import IOffice from "../types/office.type";

const create = (id: number, data: IOffice) => {
  return http.post(`/offices/elections/${id}`, data);
};

const update = (id: number, data: IOffice) => {
  return http.put(`/offices/${id}`, data);
};

const removeBatch = (data: number[]) => {
  return http.post(`/offices/deleteBatch`, data);
};

const checkTitle = (id: string) => {
  return http.get(`/office/${id}`);
};

const exportedObject = {
  checkTitle,
  create,
  update,
  removeBatch,
};

export default exportedObject;

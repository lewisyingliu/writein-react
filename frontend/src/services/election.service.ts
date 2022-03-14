import http from "./http.common";
import IElection from "../types/election.type";

const getAll = () => {
  return http.get("/elections");
};

const get = (id: number) => {
  return http.get(`/elections/${id}`);
};

const create = (data: IElection) => {
  return http.post("/elections", data);
};

const update = (id: number, data: IElection) => {
  return http.put(`/elections/${id}`, data);
};

const remove = (id: number) => {
  return http.delete(`/elections/${id}`);
};

const removeAll = () => {
  return http.delete(`/elections`);
};

const removeBatch = (data: number[]) => {
  return http.post(`/elections/deleteBatch`, data);
};

const getCurrentElection = () => {
  return http.get(`/elections/defaultTag`);
};

const exportedObject = {
  getAll,
  get,
  create,
  update,
  remove,
  removeBatch,
  removeAll,
  getCurrentElection,
};

export default exportedObject;

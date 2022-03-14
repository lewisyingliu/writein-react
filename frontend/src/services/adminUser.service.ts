import http from "./http.common";
import IUser from "../types/user.type";

const getAll = () => {
  return http.get("/adminUsers");
};

const get = (id: number) => {
  return http.get(`/adminUsers/${id}`);
};

const create = (data: IUser) => {
  return http.post("/adminUsers", data);
};

const update = (id: number, data: IUser) => {
  return http.put(`/adminUsers/${id}`, data);
};

const remove = (id: number) => {
  return http.delete(`/adminUsers/${id}`);
};

const removeBatch = (data: number[]) => {
  return http.post(`/adminUsers/deleteBatch`, data);
};

const checkUsername = (id: string) => {
  return http.get(`/adminUser/${id}`);
};

const exportedObject = {
  getAll,
  get,
  create,
  update,
  remove,
  removeBatch,
  checkUsername,
};

export default exportedObject;

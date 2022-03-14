import http from "./http.common";
import IUser from "../types/user.type";
import IUserInput from "../types/userInput.type";

const create = (id: number, data: IUser) => {
  return http.post(`/users/elections/${id}`, data);
};

const createBatch = (id: number, data: IUserInput) => {
  return http.post(`/users/createBatch/${id}`, data);
};

const update = (id: number, data: IUser) => {
  return http.put(`/users/${id}`, data);
};

const removeBatch = (data: number[]) => {
  return http.post(`/users/deleteBatch`, data);
};

const printBatch = (data: number[]) => {
  return http.post(`/users/printBatch`, data, { responseType: "blob" });
};

const checkUsernameContaining = (data: IUser) => {
  return http.post(`/user`, data);
};

const checkUsername = (id: string) => {
  return http.get(`/user/${id}`);
};

const getCurrentUser = (id: number) => {
  return http.get(`/users/${id}`);
};

const exportedObject = {
  checkUsername,
  checkUsernameContaining,
  create,
  createBatch,
  update,
  printBatch,
  removeBatch,
  getCurrentUser,
};

export default exportedObject;

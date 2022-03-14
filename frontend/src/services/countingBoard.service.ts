import http from "./http.common";
import ICountingBoard from "../types/countingBoard.type";
import IUserInput from "../types/userInput.type";

const create = (id: number, data: ICountingBoard) => {
  return http.post(`/countingBoards/elections/${id}`, data);
};

const createBatch = (id: number, data: IUserInput) => {
  return http.post(`/countingBoards/createBatch/${id}`, data);
};

const update = (id: number, data: ICountingBoard) => {
  return http.put(`/countingBoards/${id}`, data);
};

const removeBatch = (data: number[]) => {
  return http.post(`/countingBoards/deleteBatch`, data);
};

const checkTitle = (id: string) => {
  return http.get(`/countingBoard/${id}`);
};

const checkUserInput = (data: IUserInput) => {
  return http.post(`/countingBoard`, data);
};

const exportedObject = {
  checkTitle,
  checkUserInput,
  create,
  createBatch,
  update,
  removeBatch,
};

export default exportedObject;

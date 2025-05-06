import { IBackendRes, IModelPaginate, IUser } from "../types/backend";
import axios from "./axios-customize";

export const callCreateUser = (user: IUser) => {
  return axios.post<IBackendRes<IUser>>("/api/v1/users", { ...user });
};

export const callUpdateUser = (user: IUser, id: string) => {
  return axios.patch<IBackendRes<IUser>>(`/api/v1/users/${id}`, { ...user });
};

export const callDeleteUser = (id: string) => {
  return axios.delete<IBackendRes<IUser>>(`/api/v1/users/${id}`);
};

export const callFetchUser = (query: string) => {
  return axios.get<IBackendRes<IModelPaginate<IUser>>>(
    `/api/v1/users?${query}`
  );
};

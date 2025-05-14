import { IBackendRes, IJob, IModelPaginate } from "../types/backend";
import axios from "./axios-customize";

export const callCreateJob = (job: IJob) => {
  return axios.post<IBackendRes<IJob>>("/api/v1/jobs", { ...job });
};

export const callUpdateJob = (job: IJob, id: string) => {
  return axios.patch<IBackendRes<IJob>>(`/api/v1/jobs/${id}`, { ...job });
};

export const callDeleteJob = (id: string) => {
  return axios.delete<IBackendRes<IJob>>(`/api/v1/jobs/${id}`);
};

export const callFetchJob = (query: string) => {
  return axios.get<IBackendRes<IModelPaginate<IJob>>>(`/api/v1/jobs?${query}`);
};

export const callFetchJobById = (id: string) => {
  return axios.get<IBackendRes<IJob>>(`/api/v1/jobs/${id}`);
};

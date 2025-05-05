import { IBackendRes, ICompany, IModelPaginate } from "../types/backend";
import axios from "./axios-customize";

export const callCreateCompany = (
  name: string,
  address: string,
  description: string,
  logo: string
) => {
  return axios.post<IBackendRes<ICompany>>("/api/v1/companies", {
    name,
    address,
    description,
    logo,
  });
};

export const callUpdateCompany = (
  id: string,
  name: string,
  address: string,
  description: string,
  logo: string
) => {
  return axios.patch<IBackendRes<ICompany>>(`/api/v1/companies/${id}`, {
    name,
    address,
    description,
    logo,
  });
};

export const callDeleteCompany = (id: string) => {
  return axios.delete<IBackendRes<ICompany>>(`/api/v1/companies/${id}`);
};

export const callFetchCompany = (query: string) => {
  return axios.get<IBackendRes<IModelPaginate<ICompany>>>(
    `/api/v1/companies?${query}`
  );
};

export const callFetchCompanyById = (id: string) => {
  return axios.get<IBackendRes<ICompany>>(`/api/v1/companies/${id}`);
};

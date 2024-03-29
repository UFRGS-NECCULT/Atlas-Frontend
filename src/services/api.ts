import axios from "axios";
import qs from "query-string";

const baseURL = process.env.REACT_APP_API_HOST || "http://localhost:8080/api";

const api = axios.create({
  baseURL
  // baseURL: "http://ec2-18-231-176-22.sa-east-1.compute.amazonaws.com:3333/api"
});

export const getBars = async (eixo = 1, params) => {
  return await api.get(`/eixo/${eixo}/bars?${qs.stringify(params)}`);
};

export const getLines = async (eixo = 1, params) => {
  return await api.get(`/eixo/${eixo}/lines?${qs.stringify(params)}`);
};

export const getMap = async (eixo = 1, params) => {
  return await api.get(`/eixo/${eixo}/map?${qs.stringify(params)}`);
};

export const getWorld = async (eixo = 4, params) => {
  return await api.get(`/eixo/${eixo}/world?${qs.stringify(params)}`);
};

export const getTreemapCad = async (eixo = 1, params) => {
  return await api.get(`/eixo/${eixo}/treemap?${qs.stringify(params)}`);
};

export const getTreemapUF = async (eixo = 1, params) => {
  return await api.get(`/eixo/${eixo}/treemap-uf?${qs.stringify(params)}`);
};

export const getDonut = async (eixo = 1, params) => {
  return await api.get(`/eixo/${eixo}/donut?${qs.stringify(params)}`);
};

export const getConfig = async (eixo = 1, num) => {
  return await api.get(`/eixo/${eixo}/config?var=${num}`);
};
export const getInfo = async (eixo = 1, params) => {
  return await api.get(`/eixo/${eixo}/info?${qs.stringify(params)}`);
};

export const getCsv = async (params) => {
  return await api.get(`csv?${qs.stringify(params)}`, { responseType: "arraybuffer" });
};

export const getSQL = async () => {
  return await api.get(`sql`, { responseType: "arraybuffer" });
};

export const getCsvFiles = async (params) => {
  return await api.get(`csv/files?${qs.stringify(params)}`);
};

export const getVisualization = async (eixo = 1, params) => {
  return await api.get(`/eixo/${eixo}/visualization?${qs.stringify(params)}`);
};

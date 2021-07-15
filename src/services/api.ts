import axios from "axios";
import qs from "query-string";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_HOST || "http://localhost:8080/api"
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

export const getTreemap = async (eixo = 1, params) => {
  return await api.get(`/eixo/${eixo}/treemap?${qs.stringify(params)}`);
};

export const getDonut = async (eixo = 1, params) => {
  return await api.get(`/eixo/${eixo}/donut?${qs.stringify(params)}`);
};

export const getBreadcrumb = async (eixo = 1, num) => {
  return await api.get(`/eixo/${eixo}/breadcrumb?var=${num}`);
};
export const getInfo = async (eixo = 1, params) => {
  return await api.get(`/eixo/${1}/info?${qs.stringify(params)}`);
};

export const getVisualization = async (eixo = 1, params) => {
  return await api.get(`/eixo/${eixo}/visualization?${qs.stringify(params)}`);
};

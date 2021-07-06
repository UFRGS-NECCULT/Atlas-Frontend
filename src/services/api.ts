import axios from "axios";
import qs from "query-string";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_HOST || "http://localhost:8080/api"
  // baseURL: "http://ec2-18-231-176-22.sa-east-1.compute.amazonaws.com:3333/api"
});

export const getBars = async (eixo = 1, params) => {
  return await api.get(`/eixo/${eixo}/stacked-bars?${qs.stringify(params)}`);
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

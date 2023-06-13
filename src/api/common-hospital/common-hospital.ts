import { http } from 'msun-lib-ui';

const api = http.create({ baseURL: process.env.VUE_APP_TIGC_API });

/* 查询 医院配置 列表分页  */
const getAppointConfigByPage = (params: any) => {
  return api.post('/appointConfig/findListByPage', params);
};
/* 查询单个配置 */
const getConfigValue = (configCode: any) => {
  return api.get(`/fzConfig/getConfigValue/${configCode}`);
};
/* 查询单个图片配置 */
const getPictureConfigValue = (pictureCode: any) => {
  return api.get(`/fzPicture/getPictureCodeValue/${pictureCode}`);
};
/* 查询信息 */
const getAppointConfigValue = (id: any) => {
  return api.get(`/appointConfig/getMzConfigById/${id}`);
};
/* 更新配置 */
const upDateConfig = (param: any) => {
  return api.post('/appointConfig/updateConfig', param);
};

/* 查询 字典列表分页  */
const getAppointDictItemByPage = (params: any) => {
  return api.post('/appointDictItem/findByPage', params);
};
/*  字典保存  */
const saveAppointDictItemByPage = (params: any) => {
  return api.post('/appointDictItem/save', params);
};
/* 更新 字典  */
const updateAppointDictItemByPage = (params: any) => {
  return api.post('/appointDictItem/update', params);
};
/* 查询 字典  组列表分页  */
const getAppointDictGroupByPage = (params: any) => {
  return api.post('/appointDictGroup/findByPage', params);
};
/*  字典组保存  */
const saveAppointDictGroupByPage = (params: any) => {
  return api.post('/appointDictGroup/save', params);
};
/* 更新 字典组  */
const updateAppointDictGroupByPage = (params: any) => {
  return api.post('/appointDictGroup/update', params);
};
export const ComHospitalApi = {
  getAppointConfigByPage,
  getConfigValue,
  getAppointConfigValue,
  upDateConfig,
  getAppointDictItemByPage,
  saveAppointDictItemByPage,
  updateAppointDictItemByPage,
  getAppointDictGroupByPage,
  saveAppointDictGroupByPage,
  updateAppointDictGroupByPage,
  getPictureConfigValue
};

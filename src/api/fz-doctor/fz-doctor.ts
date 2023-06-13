import { http } from 'msun-lib-ui';

const api = http.create({ baseURL: process.env.VUE_APP_TIGC_API });

/*  分诊医生 下拉列表 */
const getFzDoctorList = (params: any) => {
  return api.post('fzDoctor/findList', params);
};

/* 查询 分诊医生 分页列表 */
const getFzDoctorListByPage = (params: any) => {
  return api.post('fzDoctor/findByPage', params);
};

/* 查询 分诊医生 分页列表 */
const getFzDoctorListfindByPageToJur = (params: any) => {
  return api.post('fzDoctor/findByPageToJur', params);
};

/* 更新 分诊医生 */
const updateFzDoctor = (params: any) => {
  return api.post('fzDoctor/update', params);
};

/* 同步 分诊医生 */
const syncFzDoctor = (params: any) => {
  return api.post('fzDoctor/syncDoctor', params);
};

/* 查询 分诊医生 根据医生id */
const getFzDoctorImageById = (docId: any) => {
  return api.get('fzDoctor/getFzDoctorImageById?docId=' + docId);
};

export const fzDoctor = {
  getFzDoctorList,
  getFzDoctorListByPage,
  updateFzDoctor,
  syncFzDoctor,
  getFzDoctorImageById,
  getFzDoctorListfindByPageToJur
}

import { http } from 'msun-lib-ui';

const api = http.create({ baseURL: process.env.VUE_APP_TIGC_API });

/* 诊区 下拉列表 */
const getFzClinicAreaList = (params: any) => {
  return api.post('/fzClinicArea/findList', params);
};

/* 查询 诊区 分页列表 */
const getFzClinicAreaListByPage = (params: any) => {
  return api.post('fzClinicArea/findByPage', params);
};

/* 更新 诊区 */
const updateFzClinicArea = (params: any) => {
  return api.post('fzClinicArea/update', params);
};

/* 新增 诊区 */
const saveFzClinicArea = (params: any) => {
  return api.post('fzClinicArea/save', params);
};

/* 删除 诊区 */
const deleteFzClinicArea = (params: any) => {
  return api.post('fzClinicArea/delete', params);
};

/* 屏幕导入 */
const export2Excel = (params:any) => {
  return api.request({
    url: '/fzClinicArea/batchAreaImport',
    method: 'post',
    data: params
  })
}

export const fzClinicArea = {
  getFzClinicAreaList,
  getFzClinicAreaListByPage,
  updateFzClinicArea,
  saveFzClinicArea,
  deleteFzClinicArea,
  export2Excel
}

import { http } from 'msun-lib-ui';

const api = http.create({ baseURL: process.env.VUE_APP_TIGC_API });

/* 生成号源 */
const generateSignal = (params: any) => {
  return api.post('/fzQueueTemplate/generateSignal', params);
};

/* 查询类型列表 */
const queryQueueTypeList = (params: any) => {
  return api.post('/fzQueueType/findList', params)
}

/* 保存模板 */
const save = (params: any) => {
  return api.post('/fzQueueTemplate/saveSignal', params)
}

/* 快速调整 */
const adjustmentSignal = (params: any) => {
  return api.post('/fzQueueTemplate/adjustmentSignal', params)
}

/* 查询科室下拉列表 */
const getDept = (params: any) => {
  return api.post('/department/getDepartmentList', params)
}

/* 查询医生下拉列表 */
const getDoc = (params: any) => {
  return api.post('/fzDoctor/findList', params)
}

export const tmTemplateManage = {
  generateSignal,
  queryQueueTypeList,
  save,
  adjustmentSignal,
  getDept,
  getDoc
}

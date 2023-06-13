import { http } from 'msun-lib-ui';

const api = http.create({ baseURL: process.env.VUE_APP_TIGC_API });

/* 分页查询工作站列表 */
const queryWorkstationListByPage = (params: any) => {
  return api.post('/fzWorkStation/findByPage', params)
}

/* 查询工作站列表 */
const queryWorkstationData = (params: any) => {
  return api.post('/fzWorkStation/findList', params)
}

/* 保存 */
const save = (params: any) => {
  return api.post('/fzWorkStation/save', params)
}

/* 更新 */
const update = (params: any) => {
  return api.post('/fzWorkStation/update', params)
}

/* 删除 */
const del = (params: any) => {
  return api.post('/fzWorkStation/delete', params)
}

/* 停用医生 */
const delDoc = (params: any) => {
  return api.post('/fzWorkStation/deleteDoc', params)
}

/* 屏幕导入 */
const export2Excel = (params:any) => {
  return api.request({
    url: '/fzWorkStation/batchWorkImport',
    method: 'post',
    data: params
  })
}

export const fzWorkstation = {
  queryWorkstationListByPage,
  queryWorkstationData,
  save,
  update,
  del,
  delDoc,
  export2Excel
}

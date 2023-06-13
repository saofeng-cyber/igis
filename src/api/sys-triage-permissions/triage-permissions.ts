import { http } from 'msun-lib-ui';

const api = http.create({ baseURL: process.env.VUE_APP_TIGC_API });

/* 分页查询分诊诊区 */
const queryTriagePermissions = (params: any) => {
  return api.post('fzTriageAuth/findByPage', params)
}

/* 保存 */
const save = (params: any) => {
  return api.post('fzTriageAuth/save', params)
}

/* 更新 */
const update = (params: any) => {
  return api.post('fzTriageAuth/update', params)
}

/* 删除 */
const delTriagePermissions = (params: any) => {
  return api.post('fzTriageAuth/delete', params)
}

export const triagePermissions = {
  queryTriagePermissions,
  save,
  update,
  delTriagePermissions
}

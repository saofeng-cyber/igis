import { http } from 'msun-lib-ui';

const api = http.create({ baseURL: process.env.VUE_APP_TIGC_API });

/* 查询类型列表 */
const queryQueueTypeList = (params: any) => {
  return api.post('/fzQueueType/findList', params)
}

/* 分页查询队列类型 */
const queryQueueTypeData = (params: any) => {
  return api.post('/fzQueueType/findByPage', params)
}

/* 根据id查询队列类型信息 */
const queryQueueTypeById = (id: any) => {
  return api.get('/fzQueueType/getFzQueueTypeById?id=' + id)
}

/* 保存 */
const save = (params: any) => {
  return api.post('/fzQueueType/save', params)
}

/* 更新 */
const update = (params: any) => {
  return api.post('/fzQueueType/update', params)
}

/* 删除 */
const delQueueType = (params: any) => {
  return api.post('/fzQueueType/delete', params)
}

/* 转诊 */
const referralPatient = (params: any) => {
  return api.post('/fzQueue/referralPatient', params)
}

/* 分诊台队列类型查询 */
const findQueueTypeListByTriage = (params: any) => {
  return api.post('/fzQueueType/findListByTriage', params)
}

export const tmQueueType = {
  queryQueueTypeList,
  queryQueueTypeData,
  queryQueueTypeById,
  save,
  update,
  delQueueType,
  referralPatient,
  findQueueTypeListByTriage
}

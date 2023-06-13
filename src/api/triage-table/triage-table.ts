import { http } from 'msun-lib-ui';

const api = http.create({ baseURL: process.env.VUE_APP_TIGC_API });

/**
 *
 * @param params 获取全部队列信息
 * @returns list
 */
const selectPatientListByDocPower = (params: any) => {
  return api.post('/fzTriageFlat/selectPatientListByDocPower', params)
}

/* 分页查询就诊记录列表 */
const getDedicalRecordList = (params: any) => {
  return api.post('/fzTriageFlat/getDiagnosedQueue', params)
}

/* 分页查询待分诊患者 */
const getQueryStayTriageList = (params: any) => {
  return api.post('/fzStayQueue/selectStayQueueList', params)
}

/* 分页查询待分诊患者 */
const getQueryTriageRecordList = (params: any) => {
  return api.post('/fzQueueLog/queryQueueLogByPage', params)
}

/* 分页查询分诊队列列表 */
const getTriageQueueList = (params: any) => {
  return api.post('/fzTriageFlat/getQueueByRoomIdOrDocId', params)
}

/* 修改分诊队列类型 */
const deleteQueue = (params: any) => {
  return api.post('/fzQueue/delete', params)
}

/* 过号患者重置为普通患者 */
const changePatCallStatus = (params: any) => {
  return api.post('/fzTriageFlat/changePatCallStatus', params)
}

/* 侧边栏诊区/诊室下拉 */
const getFzClinicAreaByUserId = () => {
  return api.get('/fzUserVsArea/getFzClinicAreaByUserId')
}

/* 分诊台展示队列数量信息 */
const getNum = (params: any) => {
  return api.post('/fzTriageFlat/getQuantityQuery', params)
}

/* 分诊台查询未登录医生队列信息 */
const getNotLoginDocAndQueue = (params: any) => {
  return api.post('/fzTriageFlat/getNotLoginDocAndQueue', params)
}

/* 刷卡操作 */
const getPatInfoByCard = (params: any) => {
  return api.post('/fzStayQueue/swipingCard', params)
}

/* 诊室候诊人数 */
const getWattingNum = (params: any) => {
  return api.post('/fzQueue/getWattingNum', params)
}
/* 查询上次预约就诊记录 */
const getLastQueueByPatient = (params: any) => {
  return api.post('/fzQueue/getLastQueueByPatient', params)
}
/* 门诊医生 确认分诊 */
const confirmTriage = (params: any) => {
  console.info(params)
  return api.post('/fzQueue/confirmTriage', params)
}
/* 医技心电 确认分诊 */
const confirmTriageForEcg = (params: any) => {
  console.info(params)
  return api.post('/fzQueue/confirmTriageForEcg', params)
}
/* 查询默认分诊类型 */
const getDefaultQueueType = (params: any) => {
  return api.post('/fzQueue/getDefaultQueueTypeCode', params)
}
/* 查询默认分诊类型 (预约挂号模式下) */
const getDefaultQueueTypeForAppointment = (params: any) => {
  return api.post('/fzQueue/getDefaultQueueTypeCodeForAppointment', params)
}
/* 根据诊区id查询诊室信息 */
const getRoomByClinicArea = (params: any) => {
  return api.get('/fzRoom/getRoomByClinicAreaId', { params })
}
/* 根据诊室id查询在线医生信息 */
const getFzWorkstationByRoomId = (params: any) => {
  return api.get('/fzWorkStation/getFzWorkstationByRoomId', { params })
}
/* 查询医生的登录信息 */
const getTriageToDocInfo = (docId: any) => {
  return api.get(`fzQueue/getTriageToDocInfo/${docId}`)
}
/* 根据诊区诊室id查在线医生 */
const getDocByAreaIdRoomId = (clinicAreaId: any, roomId:any) => {
  return api.get('/fzUserVsArea/getDocByAreaIdRoomId?clinicAreaId=' + clinicAreaId + '&roomId=' + roomId)
}
/* 查询当前导医下管辖诊区（区分权限） */
const getAllAreaByUserId = () => {
  return api.get('/fzUserVsArea/getAllAreaByUserId')
}
/* 打印小票 */
const printTicket = (queueId: any) => {
  return api.get('/fzQueue/printTicket?queueId=' + queueId)
}
/* 停用医生 */
const delDoc = (params: any) => {
  return api.post('/fzWorkStation/deleteDoc', params)
}
/* 查询登录账号的 角色信息 */
const getHisRoleIdByDocId = () => {
  return api.get('/fzDoctor/getHisRoleIdByDocId')
}
/* 根据住院号查患者信息（心电需要） */
const getPatInfoByInHosNo = (param: any) => {
  return api.get(`/fzQueue/queryHAForEcg/${param}`)
}
/* 待分诊列表打印小票 */
const printTicketOfStayQueue = (businessId: any) => {
  return api.get('/fzQueue/printTicketOfStayQueue?businessId=' + businessId)
}
// 诊区诊室菜单
const getAreaVsRoomMenu = () => {
  return api.get('/fzUserVsArea/getFzClinicAreaAndRoomByUserId')
}

export const triageTable = {
  getAllAreaByUserId,
  selectPatientListByDocPower,
  changePatCallStatus,
  getDocByAreaIdRoomId,
  getWattingNum,
  getPatInfoByCard,
  getNotLoginDocAndQueue,
  getNum,
  getFzClinicAreaByUserId,
  getDedicalRecordList,
  getQueryStayTriageList,
  getQueryTriageRecordList,
  getTriageQueueList,
  deleteQueue,
  getLastQueueByPatient,
  confirmTriage,
  confirmTriageForEcg,
  getDefaultQueueType,
  getRoomByClinicArea,
  getFzWorkstationByRoomId,
  getTriageToDocInfo,
  printTicket,
  delDoc,
  getDefaultQueueTypeForAppointment,
  getHisRoleIdByDocId,
  getPatInfoByInHosNo,
  printTicketOfStayQueue,
  getAreaVsRoomMenu
}

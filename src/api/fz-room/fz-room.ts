import { http } from 'msun-lib-ui';

const api = http.create({ baseURL: process.env.VUE_APP_TIGC_API });

/* 诊室窗口 下拉列表 */
const getFzRoomList = (params: any) => {
  return api.post('/fzRoom/findList', params);
};

/* 查询 诊室窗口 分页列表 */
const getFzRoomListByPage = (params: any) => {
  return api.post('fzRoom/findByPage', params);
};

/* 更新 诊室窗口 */
const updateFzRoom = (params: any) => {
  return api.post('fzRoom/update', params);
};

/* 新增 诊室窗口 */
const saveFzRoom = (params: any) => {
  return api.post('fzRoom/save', params);
};

/* 删除 诊室窗口 */
const deleteFzRoom = (params: any) => {
  return api.post('fzRoom/delete', params);
};

/* 同步数据 */
const syncData = (params: any) => {
  return api.post('/fzRoom/syncRooms', params)
}

/* 根据id查询信息 */
const getRoomById = (params: any) => {
  return api.get('/fzRoom/getFzRoomById?id=' + params);
}

/* 根据诊区id查询诊室信息 */
const getRoomsList = (params: any) => {
  return api.get('/fzRoom/getRoomByClinicAreaId?clinicAreaId=' + params);
}

/* 诊室导入 */
const export2Excel = (params:any) => {
  return api.request({
    url: '/fzRoom/batchRoomImport',
    method: 'post',
    data: params
  })
}

export const fzRoom = {
  getRoomsList,
  getFzRoomList,
  getFzRoomListByPage,
  updateFzRoom,
  saveFzRoom,
  deleteFzRoom,
  syncData,
  export2Excel,
  getRoomById
}

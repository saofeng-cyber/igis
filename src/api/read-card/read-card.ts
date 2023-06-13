import { http } from 'msun-lib-ui';

const api = http.create({ baseURL: process.env.VUE_APP_SWIPE_API });

/* 查询当卡类型信息 */
const findCardTypes = () => {
  return api.get('/readCard/findCardTypes');
}
/* 读卡 cardTypeId  patCardNo */
const readCard = (params:any) => {
  return api.get('/readCard/findPatientsByCard', { params });
}

export const readCardApi = {
  findCardTypes,
  readCard
};

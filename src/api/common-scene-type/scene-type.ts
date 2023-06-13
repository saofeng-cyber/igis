import { http } from 'msun-lib-ui';

const api = http.create({ baseURL: process.env.VUE_APP_TIGC_API });

/* 查询场景类型 */
const getSceneTypeList = (params: any) => {
  return api.post('/tigcGuidanceDictItem/getDictItemListByGroup', params);
};

/* 查询场景子类型 */
const getSceneSubTypeList = (params: any) => {
  return api.post('/fzSceneSubType/findList', params);
};

const getDictItemListByGroupOfAll = (params: any) => {
  return api.post('/tigcGuidanceDictItem/getDictItemListByGroupOfAll', params);
}

const queryDictDrugBasicMainCatagory = () => {
  return api.post('/fzDrugQueue/queryDictDrugBasicMainCatagory', {})
}

export const sceneType = {
  getSceneTypeList,
  getSceneSubTypeList,
  getDictItemListByGroupOfAll,
  queryDictDrugBasicMainCatagory
}

import { http } from 'msun-lib-ui';

const api = http.create({ baseURL: process.env.VUE_APP_GET_MENU });

const getAsyncMenu = (params: any) => {
  return api.get('/menu/findMenuById', {
    params: params
  });
};

// 获取授权

const getPublishedSystemAuthorizedForList = () => api.post('/fzSceneSubType/isPublishedSystemAuthorizedForList')

export const menu = {
  getAsyncMenu,
  getPublishedSystemAuthorizedForList
};

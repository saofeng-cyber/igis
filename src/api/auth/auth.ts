import { http } from 'msun-lib-ui';

const api = http.create({ baseURL: process.env.VUE_APP_TIGC_API });

const getPublishedSystemAuthorizedForList = (params: any) => api.post('/fzSceneSubType/isPublishedSystemAuthorizedForList', params)

export const auth = {
  getPublishedSystemAuthorizedForList
};

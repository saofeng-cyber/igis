import { http } from 'msun-lib-ui';

const api = http.create({ baseURL: process.env.VUE_APP_TIGC_API });

// 获取菜单信息
const getAsyncMenu = (params: any) => api.get('/menu/findMenuById', { params });

export const common = {
  getAsyncMenu
};

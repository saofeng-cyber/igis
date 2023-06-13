import { http } from 'msun-lib-ui';
const api = http.create({ baseURL: process.env.VUE_APP_LIS_FINANCE });

const QueryAccountInfo = (params: any) => {
  return api.post('api/patAccount/queryAccountInfo', params);
};
export const patAccountApi = {
  QueryAccountInfo
}

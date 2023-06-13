import { http } from 'msun-lib-ui';

const api = http.create({ baseURL: process.env.VUE_APP_TIGC_API })

const selectDocInForByWork = () => {
  return api.post('/fzWorkStation/selectDocInForByWork', {});
};

export const fzPacsScreen = {
  selectDocInForByWork
}

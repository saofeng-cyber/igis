import { http } from 'msun-lib-ui'

const api = http.create({ baseURL: process.env.VUE_APP_BASEREPORT_API });

// 调用报报表打印平台
const printContent = (params: any) => {
  return api.post('/basereport/BaseReportService/getPrintContent', params);
}

export const triagePrint = {
  printContent
}

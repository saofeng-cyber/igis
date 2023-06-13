interface PatInfoCard {
    patientName: string;
    patientCard: string;
    clinicAreaName?: string;
    roomName?: string;
    docName?: string;
    patientIdCard?: string;
}
interface TriageObj {
    businessFee: string;
    businessId: string;
    businessName: string;
    businessTime: string;
    callerCode: string; // 固定值，不可修改！
    doctorId: string;
    medicalCardNumber: string;
    queueTypeId: number;
    roomId: string;
    serialNumber: string;
    sourceChannelCode: string;
    allowOnlineRoomDoc: number; // 允许分诊到诊室医生标识（0不启用，1启用）
}
interface DefaultQueueTypeParams {
    outPatId: string,
    patientCard: string,
    hospitalId: string,
    businessId: string,
    rooms: string[]
}
interface Message {
    flag: boolean;
    text: any;
}

interface CartTypeObj {
    cardTypeId: string,
    cardTypeName: string,
    cardLength: number,
    invalidFlag: string,
    decodeFlag: string,
    decodeType: string,
    readCardInvokeFlag: string,
    creadCardInvokeFlag: string,
    virtualCardFlag: string,
    virtualCardTypeId: string,
    specialTypeFlag: string,
    readCardInvoke: boolean,
    decode: boolean,
    createVirtualCard: boolean,
    creadCardInvoke: boolean,
    yuanNeiJiuZhenKA: boolean,
    qvYuJiuZhenKA: boolean,
    idCard: boolean,
    invalid: boolean,
    hospitalId: string,
    orgId: string
}
interface CardContent {
    cardTypeId?: string| null
    patCardNo: number| null
    patName?: string | null
    idcardNo?: string
}
export {
  PatInfoCard,
  TriageObj,
  DefaultQueueTypeParams,
  Message,
  CartTypeObj,
  CardContent
}

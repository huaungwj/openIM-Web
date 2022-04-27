import ELogin from './en/login';
import ZLogin from './zh-CN/login';
import EUserSetting from './en/userSetting';
import ZUserSetting from './zh-CN/userSetting';
import EComm from './en/comm';
import ZComm from './zh-CN/comm';
import ECve from './en/cve';
import ZCve from './zh-CN/cve';
import EReqAddMsg from './en/requestAddMsg';
import ZReqAddMsg from './zh-CN/requestAddMsg';
import ZFace from './zh-CN/face';
import EFace from './en/face';

export default {
  en: {
    login: ELogin,
    userSetting: EUserSetting,
    ...EComm,
    cve: ECve,
    reqMsg: EReqAddMsg,
    face: EFace,
  },
  'zh-CN': {
    login: ZLogin,
    userSetting: ZUserSetting,
    ...ZComm,
    cve: ZCve,
    reqMsg: ZReqAddMsg,
    face: ZFace,
  },
};

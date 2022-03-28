import { cvRequest, adminRequest } from '../index';
import type {
  getCodetype,
  verifyCodeType,
  resetPwdType,
  setRegPwdType,
  getUserTokenType,
} from './type';

/**
 * 查询所有队列名称
 */
// export function findAllQueueRequest() {
//   return cvRequest.get({
//     url: '/broker/count/queue/name',
//   });
// }

/**
 *  发送验证码
 * @param data
 * @returns
 */
export function APIGetCode(data: getCodetype) {
  return cvRequest.instance({
    method: 'POST',
    url: `/auth/code`,
    data,
  });
}

/**
 * 提交验证码
 * @param data
 * @returns
 */
export function APIVerifyCode(data: verifyCodeType) {
  return cvRequest.instance({
    method: 'POST',
    url: `/auth/verify`,
    data,
  });
}
/**
 * 重置密码
 * @param data
 * @returns
 */
export function APIResetPassword(data: resetPwdType) {
  return cvRequest.instance({
    method: 'POST',
    url: '/auth/reset_password',
    data,
  });
}

/**
 * 新用户设置账号密码
 * @param data
 * @returns
 */
export function APISetRegisterPwd(data: setRegPwdType) {
  return cvRequest.instance({
    method: 'POST',
    url: '/auth/password',
    data,
  });
}
/**
 * 获取用户 token
 * @param data
 * @type setRegPwdType
 * @returns
 */
export function APIGetAuthToken(data: getUserTokenType) {
  return adminRequest.instance({
    method: 'POST',
    url: '/auth/user_token',
    data,
  });
}

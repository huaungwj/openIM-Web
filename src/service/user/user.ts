import cvRequest from '../index';
import type { getCodetype } from './type';

/**
 * 查询所有队列名称
 */
// export function findAllQueueRequest() {
//   return cvRequest.get({
//     url: '/broker/count/queue/name',
//   });
// }

// 发送验证码
export function getCode(data: getCodetype) {
  return cvRequest.instance({
    method: 'POST',
    url: `/auth/code`,
    data,
  });
}

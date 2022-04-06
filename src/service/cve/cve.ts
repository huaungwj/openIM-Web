import { adminRequest } from '../index';
import { uuid } from '@/tools/im';

export const getOnline = async (
  userIDList: string[],
  token: string,
  opid?: string
) => {
  return adminRequest.instance({
    method: 'POST',
    url: '/manager/get_users_online_status',
    data: JSON.stringify({
      operationID: opid ?? uuid('uuid'),
      userIDList,
    }),
    headers: {
      token,
    },
  });
};

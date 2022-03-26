export type getCodetype = {
  phoneNumber: string; // 用户电话号码
  usedFor: number; // 用于 1表示注册用户，2表示忘记密码
  operationID: string; //操作ID，保持唯一，建议用当前时间微秒+随机数
};

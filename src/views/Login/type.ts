// 登录表单数据
export type FormValueType = {
  areaCode: string;
  phone: string;
  password: string;
  checked: boolean;
};

// 忘记密码响应
export type errCode = {
  errCode: string;
};

// 重新设置密码表单
export type resetPasswordFormType = {
  password: string;
  cPassword: string;
};

// 用户信息
export type InfoField = {
  userID: string;
  nickname: string;
  faceURL: string;
};

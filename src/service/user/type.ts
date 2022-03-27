// 获取验证码 接口参数
export type getCodetype = {
  phoneNumber: string; // 用户电话号码
  usedFor: number; // 用于 1表示注册用户，2表示忘记密码
  operationID: string; //操作ID，保持唯一，建议用当前时间微秒+随机数
};

// 验证验证码
export type verifyCodeType = {
  phoneNumber: string; // 用户电话号码
  verificationCode: string; // 验证码
  usedFor: number; //用于 1表示注册用户，2表示忘记密码
  operationID: string; //操作ID，保持唯一，建议用当前时间微秒+随机数
};

// 重设密码
export type resetPwdType = {
  phoneNumber: string; // 电话号码
  verificationCode: string; // 验证码
  newPassword: string; // 新密码 md5 + 秘钥
  platform: number; // 用户登录或注册的平台类型 iOS 1, Android 2, Windows 3, OSX 4, WEB 5, 小程序 6，linux 7
  operationID: string; //操作ID，保持唯一，建议用当前时间微秒+随机数
};

// 新用户设置密码
export type setRegPwdType = {
  phoneNumber: string; // 电话号码
  verificationCode: string; // 验证码
  password: string; // 密码 md5(md5(password) + MD5_KEY)
  platform: number; // 用户登录或注册的平台类型 iOS 1, Android 2, Windows 3, OSX 4, WEB 5, 小程序 6，linux 7
  operationID: string; //操作ID，保持唯一，建议用当前时间微秒+随机数
};

// 获取用户 token
export type getUserTokenType = {
  secret: string; // OpenIM秘钥
  platform: number; // 用户登录或注册的平台类型 iOS 1, Android 2, Windows 3, OSX 4, WEB 5, 小程序 6，linux 7
  userID: string; // 用户id
  operationID: string; //操作ID，保持唯一，建议用当前时间微秒+随机数
};

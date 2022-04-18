export enum messageTypes {
  TEXTMESSAGE = 101,
  PICTUREMESSAGE = 102, // 图片消息
  VOICEMESSAGE = 103, //	音频消息
  VIDEOMESSAGE = 104, // 	视频消息
  FILEMESSAGE = 105, // 文件消息
  ATTEXTMESSAGE = 106, // 	群聊中的@类型消息
  MERGERMESSAGE = 107, // 	合并转发类型消息
  CARDMESSAGE = 108, // 	名片消息
  LOCATIONMESSAGE = 109, // 地理位置类型消息
  CUSTOMMESSAGE = 110, // 自定义消息
  REVOKEMESSAGE = 111, // 撤回类型消息
  HASREADRECEIPTMESSAGE = 112, // 已读回执类型消息
  TYPINGMESSAGE = 113, // 正在输入
  QUOTEMESSAGE = 114, //	引用类型消息
}

export enum tipsTypes {
  REVOKEMESSAGE = 111,
  FRIENDAPPLICATIONAPPROVED = 1201, //add_friend_response
  FRIENDAPPLICATIONREJECTED = 1202, //add_friend_response
  FRIENDAPPLICATIONADDED = 1203, //add_friend
  FRIENDADDED = 1204,
  FRIENDDELETED = 1205, //delete_friend
  FRIENDREMARKSET = 1206, //set_friend_remark?
  BLACKADDED = 1207, //add_black
  BLACKDELETED = 1208, //remove_black
  SELFINFOUPDATED = 1303, //SetSelfInfoTip
  GROUPCREATED = 1501, // 创建群聊
  GROUPINFOUPDATED = 1502, // 修改群信息
  JOINGROUPAPPLICATIONADDED = 1503,
  MEMBERQUIT = 1504,
  GROUPAPPLICATIONACCEPTED = 1505,
  GROUPAPPLICATIONREJECTED = 1506,
  GROUPOWNERTRANSFERRED = 1507,
  MEMBERKICKED = 1508,
  MEMBERINVITED = 1509,
  MEMBERENTER = 1510, // 新成员
}

export const nomalMessageTypes = [
  messageTypes.TEXTMESSAGE,
  messageTypes.ATTEXTMESSAGE,
  messageTypes.CARDMESSAGE,
  messageTypes.MERGERMESSAGE,
  messageTypes.LOCATIONMESSAGE,
  messageTypes.CUSTOMMESSAGE,
  messageTypes.REVOKEMESSAGE,
  messageTypes.HASREADRECEIPTMESSAGE,
  messageTypes.TYPINGMESSAGE,
  messageTypes.QUOTEMESSAGE,
];

export const notOssMessageTypes = [
  messageTypes.PICTUREMESSAGE,
  messageTypes.VIDEOMESSAGE,
  messageTypes.VOICEMESSAGE,
  messageTypes.FILEMESSAGE,
];

export enum SessionType {
  SINGLECVE = 1, // 单聊
  GROUPCVE = 2, // 群聊
}

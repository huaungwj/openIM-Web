enum RequestFunc {
  INITSDK = 'InitSDK',
  LOGIN = 'Login',
  LOGOUT = 'Logout',
  GETLOGINSTATUS = 'GetLoginStatus',
  GETLOGINUSER = 'GetLoginUser',
  GETSELFUSERINFO = 'GetSelfUserInfo',
  CREATETEXTMESSAGE = 'CreateTextMessage',
  CREATETEXTATMESSAGE = 'CreateTextAtMessage',
  CREATEIMAGEMESSAGEFROMBYURL = 'CreateImageMessageByURL',
  CREATESOUNDMESSAGEBYURL = 'CreateSoundMessageByURL',
  CREATEVIDEOMESSAGEBYURL = 'CreateVideoMessageByURL',
  CREATEFILEMESSAGEBYURL = 'CreateFileMessageByURL',
  CREATELOCATIONMESSAGE = 'CreateLocationMessage',
  CREATECUSTOMMESSAGE = 'CreateCustomMessage',
  CREATEMERGERMESSAGE = 'CreateMergerMessage',
  CREATEFORWARDMESSAGE = 'CreateForwardMessage',
  CREATEQUOTEMESSAGE = 'CreateQuoteMessage',
  CREATECARDMESSAGE = 'CreateCardMessage',
  SENDMESSAGE = 'SendMessage',
  SENDMESSAGENOTOSS = 'SendMessageNotOss',
  GETHISTORYMESSAGELIST = 'GetHistoryMessageList',
  REVOKEMESSAGE = 'RevokeMessage',
  DELETEMESSAGEFROMLOCALSTORAGE = 'DeleteMessageFromLocalStorage',
  MARKSINGLEMESSAGEHASREAD = 'MarkSingleMessageHasRead',
  INSERTSINGLEMESSAGETOLOCALSTORAGE = 'InsertSingleMessageToLocalStorage',
  INSERTGROUPMESSAGETOLOCALSTORAGE = 'InsertGroupMessageToLocalStorage',
  TYPINGSTATUSUPDATE = 'TypingStatusUpdate',
  MARKC2CMESSAGEASREAD = 'MarkC2CMessageAsRead',
  CLEARC2CHISTORYMESSAGE = 'ClearC2CHistoryMessage',
  CLEARGROUPHISTORYMESSAGE = 'ClearGroupHistoryMessage',
  ADDFRIEND = 'AddFriend',
  GETDESIGNATEDFRIENDSINFO = 'GetDesignatedFriendsInfo',
  GETRECVFRIENDAPPLICATIONLIST = 'GetRecvFriendApplicationList',
  GETSENDFRIENDAPPLICATIONLIST = 'GetSendFriendApplicationList',
  GETFRIENDLIST = 'GetFriendList',
  SETFRIENDREMARK = 'SetFriendRemark',
  ADDBLACK = 'AddBlack',
  GETBLACKLIST = 'GetBlackList',
  REMOVEBLACK = 'RemoveBlack',
  CHECKFRIEND = 'CheckFriend',
  ACCEPTFRIENDAPPLICATION = 'AcceptFriendApplication',
  REFUSEFRIENDAPPLICATION = 'RefuseFriendApplication',
  DELETEFRIEND = 'DeleteFriend',
  GETUSERSINFO = 'GetUsersInfo',
  SETSELFINFO = 'SetSelfInfo',
  GETALLCONVERSATIONLIST = 'GetAllConversationList',
  GETCONVERSATIONLISTSPLIT = 'GetConversationListSplit',
  GETONECONVERSATION = 'GetOneConversation',
  GETCONVERSATIONIDBYSESSIONTYPE = 'GetConversationIDBySessionType',
  GETMULTIPLECONVERSATION = 'GetMultipleConversation',
  DELETECONVERSATION = 'DeleteConversation',
  SETCONVERSATIONDRAFT = 'SetConversationDraft',
  PINCONVERSATION = 'PinConversation',
  GETTOTALUNREADMSGCOUNT = 'GetTotalUnreadMsgCount',
  GETCONVERSATIONRECVMESSAGEOPT = 'GetConversationRecvMessageOpt',
  SETCONVERSATIONRECVMESSAGEOPT = 'SetConversationRecvMessageOpt',
  SEARCHLOCALMESSAGES = 'SearchLocalMessages',
  MARKGROUPMESSAGEHASREAD = 'MarkGroupMessageHasRead',
  INVITEUSERTOGROUP = 'InviteUserToGroup',
  KICKGROUPMEMBER = 'KickGroupMember',
  GETGROUPMEMBERSINFO = 'GetGroupMembersInfo',
  GETGROUPMEMBERLIST = 'GetGroupMemberList',
  GETJOINEDGROUPLIST = 'GetJoinedGroupList',
  CREATEGROUP = 'CreateGroup',
  SETGROUPINFO = 'SetGroupInfo',
  GETGROUPSINFO = 'GetGroupsInfo',
  JOINGROUP = 'JoinGroup',
  QUITGROUP = 'QuitGroup',
  TRANSFERGROUPOWNER = 'TransferGroupOwner',
  GETSENDGROUPAPPLICATIONLIST = 'GetSendGroupApplicationList',
  GETRECVGROUPAPPLICATIONLIST = 'GetRecvGroupApplicationList',
  ACCEPTGROUPAPPLICATION = 'AcceptGroupApplication',
  REFUSEGROUPAPPLICATION = 'RefuseGroupApplication',
}

enum CbEvents {
  // -------------------- 连接状态监听回调 ------------------------
  ONCONNECTFAILED = 'OnConnectFailed', // 连接失败
  ONCONNECTSUCCESS = 'OnConnectSuccess', // 连接成功
  ONCONNECTING = 'OnConnecting', // 连接中
  ONKICKEDOFFLINE = 'OnKickedOffline', // 被踢下线
  ONSELFINFOUPDATED = 'OnSelfInfoUpdated', // 修改个人信息
  ONUSERTOKENEXPIRED = 'OnUserTokenExpired', // 账号token过期
  // -------------------   消息发送状态监听回调 ----------------------
  SENDMSGPROGRESS = 'OnProgress', // 消息发送进度
  // -------------------------- 接收新消息监听回调----------------------
  ONRECVNEWMESSAGE = 'OnRecvNewMessage', // 接收到新消息
  ONRECVMESSAGEREVOKED = 'OnRecvMessageRevoked', // 	其他用户撤回信息回执
  ONRECVC2CREADRECEIPT = 'OnRecvC2CReadReceipt', // 消息已读回执
  // -------------------------- 会话列表监听回调 --------------------------
  ONCONVERSATIONCHANGED = 'OnConversationChanged', // 会话发生变化时触发，有新的信息过来会触发 	会话列表发生改变
  ONNEWCONVERSATION = 'OnNewConversation', // 	有新会话产生
  ONSYNCSERVERFAILED = 'OnSyncServerFailed',
  ONSYNCSERVERFINISH = 'OnSyncServerFinish',
  ONSYNCSERVERSTART = 'OnSyncServerStart',
  ONTOTALUNREADMESSAGECOUNTCHANGED = 'OnTotalUnreadMessageCountChanged', // 消息未读总数改变
  // --------------------------- 好友关系监听回调 --------------------------
  ONBLACKADDED = 'OnBlackAdded', //	添加用户到黑名单
  ONBLACKDELETED = 'OnBlackDeleted', // 从黑名单中移除了某个用户
  ONFRIENDAPPLICATIONACCEPTED = 'OnFriendApplicationAccepted', // 好友请求被接受
  ONFRIENDAPPLICATIONADDED = 'OnFriendApplicationAdded', // 好友请求列表增加
  ONFRIENDAPPLICATIONDELETED = 'OnFriendApplicationDeleted', // 好友请求列表减少
  ONFRIENDAPPLICATIONREJECTED = 'OnFriendApplicationRejected', // 好友请求被拒绝
  ONFRIENDINFOCHANGED = 'OnFriendInfoChanged', // 关于朋友信息的更改
  ONFRIENDADDED = 'OnFriendAdded', // 	好友列表增加
  ONFRIENDDELETED = 'OnFriendDeleted', // 好友列表减少
  // ---------------------------- 群组信息改变监听回调 ---------------------------
  ONJOINEDGROUPADDED = 'OnJoinedGroupAdded', // 加入的群增加
  ONJOINEDGROUPDELETED = 'OnJoinedGroupDeleted', // 加入的群减少
  ONGROUPMEMBERADDED = 'OnGroupMemberAdded', // 有新成员加入群组
  ONGROUPMEMBERDELETED = 'OnGroupMemberDeleted', // 有群成员退出群组
  ONGROUPAPPLICATIONADDED = 'OnGroupApplicationAdded', // 入群申请有新增
  ONGROUPAPPLICATIONDELETED = 'OnGroupApplicationDeleted', // 入群申请被删除
  ONGROUPINFOCHANGED = 'OnGroupInfoChanged', // 群组信息改变
  ONGROUPMEMBERINFOCHANGED = 'OnGroupMemberInfoChanged', // 群成员信息改变
  ONGROUPAPPLICATIONACCEPTED = 'OnGroupApplicationAccepted', // 入群申请被同意
  ONGROUPAPPLICATIONREJECTED = 'OnGroupApplicationRejected', // 入群申请被拒绝
}

export { RequestFunc, CbEvents };

export default {
  // 整个message的type
  MSG_SINGLE: 1, // 单人消息
  MSG_GROUP: 2, // 群组消息
  MSG_COWORK: 3, // 协作消息
  MSG_ONLINE_GROUP: 400, // 在线群组消息

  MSG_ADD_FRIEND: 901, // 添加好友
  MSG_DEL_FRIEND: 902, // 删除好友关系
  MSG_ACCEPT_FRIEND: 903, // 同意添加好友

  MSG_MODIFY_GROUP_NAME: 911, // 修改群名
  MSG_CREATE_GROUP: 912, // 创建群
  MSG_REMOVE_MEMBER: 913, // 退出群
  MSG_DISBAND_GROUP: 914, // 解散群

  MSG_REJECT: 920, // 拒收
  MSG_LOGOUT: 999, // 下线

  // MSG_SINGLE,MSG_GROUP 中的message的type
  MSG_TEXT: 1,
  MSG_PICTURE: 2,
  MSG_FILE: 3, // 文件本体
  MSG_MAP: 6, // 地图
  MSG_GEOMETRY: 7, // 对象
  MSG_DATASET: 8, // 数据集
  MSG_LAYER: 9, // 图层
  MSG_LOCATION: 10, // 位置
  MSG_INVITE_COWORK: 21, // 协作邀请

  // MSG_COWORK 中的message的type
  MSG_JOIN_COWORK: 1, // 加入协作群
  MSG_LEAVE_COWORK: 2, // 退出协作群，不接收协作群消息
  MSG_COWORK_LIST: 3, // 协作成员列表
  MSG_COWORK_GPS: 11, // 成员当前位置
  MSG_COWORK_ADD: 12, // 添加对象
  MSG_COWORK_DELETE: 13, // 删除对象
  MSG_COWORK_UPDATE: 14, // 更新对象

  // MSG_ONLINE_GROUP 中message的type
  /** 群组申请消息 */
  MSG_ONLINE_GROUP_APPLY: 401,
  /** 群组任务消息 */
  MSG_ONLINE_GROUP_TASK: 402,
  /** 邀请加入群组消息 */
  MSG_ONLINE_MEMBER_INVITE: 403,
  /** 删除群组成员 */
  MSG_ONLINE_MEMBER_DELETE: 404,
}
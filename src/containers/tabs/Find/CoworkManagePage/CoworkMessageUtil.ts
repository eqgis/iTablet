interface TaskMsg {
  id: string | number,
  message: {
    type: number,
    task: any,
    module: any,
  },
  type: number,
  user: {
    name: string,
    id: string,
  },
  group: {
    groupID: string | number,
    groupName: string,
    groupCreator: string,
  },
  time: number,
}

interface Member {
  id: string,
  name: string,
}

/**
 * 群协作任务消息转为简单的数据保存
 * @param msg 发送消息的任务
 * @param members 群成员
 */
function taskMsgToData (msg: TaskMsg, members: Array<Member>) {
  return (
    {
      id: msg.id,
      type: msg.message.type,
      groupID: msg.group.groupID,
      time: msg.time,
      creator: {
        ...msg.user,
      },
      members: members,
      name: msg.message.task.resourceName.replace('.zip', ''),
      module: {
        key: msg.message.module.key,
        index: msg.message.module.index,
      },
      resource: {
        resourceId: msg.message.task.resourceId,
        resourceName: msg.message.task.resourceName,
        nickname: msg.message.task.nickname,
        resourceCreator: msg.message.task.resourceCreator,
      },
    }
  )
}

export default {
  taskMsgToData,
}
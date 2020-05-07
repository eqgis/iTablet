/**
 * Created by imobile-xzy on 2019/3/4.
 */
import { connect } from 'react-redux'
import Friend from './Friend'
import Chat from './Chat'
import ManageFriend from './Chat/ManageFriend'
import ManageGroup from './Chat/ManageGroup'
import SelectModule from './Chat/SelectModule'
import AddFriend from './AddFriend'
import InformMessage from './FriendMessage/InformMessage'
import CreateGroupChat from './FriendGroup/CreateGroupChat'
import GroupMemberList from './FriendGroup/GroupMemberList'
import RecommendFriend from './RecommendFriend'
import MsgConstant from './MsgConstant'
import SelectFriend from './SelectFriend'
import { SimpleDialog, ImageViewer } from './Component'
import { openWorkspace, closeWorkspace } from '../../../redux/models/map'
import { setUser, deleteUser } from '../../../redux/models/user'
import {
  addChat,
  editChat,
  setConsumer,
  setCoworkNewMessage,
} from '../../../redux/models/chat'

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  user: state.user.toJS(),
  chat: state.chat.toJS(),
  appConfig: state.appConfig.toJS(),
  device: state.device.toJS().device,
})

const mapDispatchToProps = {
  setUser,
  deleteUser,
  addChat,
  // addUnreadMessage,
  editChat,
  setConsumer,
  openWorkspace,
  closeWorkspace,
  setCoworkNewMessage,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Friend)

export {
  Chat,
  AddFriend,
  InformMessage,
  CreateGroupChat,
  RecommendFriend,
  ManageFriend,
  ManageGroup,
  SelectModule,
  GroupMemberList,
  MsgConstant,
  SelectFriend,
  SimpleDialog,
  ImageViewer,
}

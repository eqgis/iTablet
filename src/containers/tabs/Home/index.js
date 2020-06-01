import { connect } from 'react-redux'
import Home from './Home'
import { setShow } from '../../../redux/models/device'
import { setLanguage } from '../../../redux/models/setting'
import {
  importSceneWorkspace,
  openWorkspace,
  closeWorkspace,
} from '../../../redux/models/map'
import { setDownInformation } from '../../../redux/models/down'
import { importWorkspace } from '../../../redux/models/template'
import { setUser, deleteUser } from '../../../redux/models/user'
import { setMapModule } from '../../../redux/models/mapModules'
import {
  setBackAction,
  removeBackAction,
} from '../../../redux/models/backActions'
import AboutITablet from './AboutITablet'
import Setting from './Setting'

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  latestMap: state.map.toJS().latestMap,
  currentUser: state.user.toJS().currentUser,
  device: state.device.toJS().device,
  appConfig: state.appConfig.toJS(),
  mapModules: state.mapModules.toJS(),
  user: state.user.toJS(),
})
const mapDispatchToProps = {
  setLanguage,
  importSceneWorkspace,
  setShow,
  importWorkspace,
  openWorkspace,
  closeWorkspace,
  setUser,
  deleteUser,
  setDownInformation,
  setBackAction,
  removeBackAction,
  setMapModule,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home)

export { AboutITablet, Setting }

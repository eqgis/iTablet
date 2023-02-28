import { connect } from 'react-redux'
import Home from './Home'
import { setShow } from '../../../redux/models/device'
import { setLanguage } from '../../../redux/models/setting'
import {
  importSceneWorkspace,
  openWorkspace,
  closeWorkspace,
} from '../../../redux/models/map'
import { importWorkspace } from '../../../redux/models/template'
import { setUser, deleteUser } from '../../../redux/models/user'
import {
  setBackAction,
  removeBackAction,
} from '../../../redux/models/backActions'
import AboutITablet from './AboutITablet'
import Setting from './Setting'
import {
  setGuideShow,
  setVersion,
  setMapAnalystGuide,
  setThemeGuide,
  setCollectGuide,
  setMapEditGuide,
  setMapSceneGuide,
} from '../../../redux/models/home'
import {
  setMapArGuide,
  setMapArMappingGuide,
} from '../../../redux/models/ar'

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  latestMap: state.map.toJS().latestMap,
  currentUser: state.user.toJS().currentUser,
  device: state.device.toJS().device,
  appConfig: state.appConfig.toJS(),
  mapModules: state.mapModules.toJS(),
  user: state.user.toJS(),
  guideshow: state.home.toJS().guideshow,
  mineModules: state.appConfig.toJS().mineModules,
  version: state.home.toJS().version,
  isAgreeToProtocol: state.setting.toJS().isAgreeToProtocol,
  is3dSceneFirst: state.setting.toJS().is3dSceneFirst
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
  setBackAction,
  removeBackAction,
  setGuideShow,
  setVersion,
  setMapArGuide,
  setMapArMappingGuide,
  setMapAnalystGuide,
  setThemeGuide,
  setCollectGuide,
  setMapEditGuide,
  setMapSceneGuide,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home)

export { AboutITablet, Setting }

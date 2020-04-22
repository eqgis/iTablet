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
import { setUser } from '../../../redux/models/user'
import {
  setBackAction,
  removeBackAction,
} from '../../../redux/models/backActions'
import { setCurrentMapModule } from '../../../redux/models/appConfig'
import AboutITablet from './AboutITablet'
import Setting from './Setting'

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  latestMap: state.map.toJS().latestMap,
  currentUser: state.user.toJS().currentUser,
  device: state.device.toJS().device,
  appConfig: state.appConfig.toJS(),
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
  setDownInformation,
  setBackAction,
  removeBackAction,
  setCurrentMapModule,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home)

export { AboutITablet, Setting }

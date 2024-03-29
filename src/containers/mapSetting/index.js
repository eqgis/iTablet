import { connect } from 'react-redux'
import MapSetting from './MapSetting'
import {
  setSettingData,
  setMapLegend,
  setColumnNavBar,
} from '../../redux/models/setting'
import { closeMap } from '../../redux/models/map'
import { setIsRealTime, setMemberShow } from '../../redux/models/cowork'

const mapStateToProps = state => {
  let currentUser = state.user.toJS().currentUser
  let cowork = state.cowork.toJS()
  let currentTaskInfo = cowork.coworkInfo?.[currentUser.userName]?.[cowork.currentTask.groupID]?.[cowork.currentTask.id]
  return {
    language: state.setting.toJS().language,
    nav: state.nav.toJS(),
    currentMap: state.map.toJS().currentMap,
    mapSetting: state.setting.toJS().mapSetting,
    device: state.device.toJS().device,
    mapLegend: state.setting.toJS().mapLegend,
    appConfig: state.appConfig.toJS(),
    mapModules: state.mapModules.toJS(),
    mapColumnNavBar: state.setting.toJS().mapColumnNavBar,
    currentTaskInfo: currentTaskInfo,
    currentTask: cowork.currentTask,
    user: state.user.toJS(),
    // cowork: state.cowork.toJS(),
    // currentUser: state.user.toJS().currentUser,
  }
}

const mapDispatchToProps = {
  setSettingData,
  closeMap,
  setMapLegend,
  setColumnNavBar,
  setIsRealTime,
  setMemberShow,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MapSetting)

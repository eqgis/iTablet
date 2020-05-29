import { connect } from 'react-redux'
import MapSetting from './MapSetting'
import {
  setSettingData,
  setMapLegend,
  setColumnNavBar,
} from '../../redux/models/setting'
import { closeMap } from '../../redux/models/map'

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  nav: state.nav.toJS(),
  currentMap: state.map.toJS().currentMap,
  mapSetting: state.setting.toJS().mapSetting,
  device: state.device.toJS().device,
  mapLegend: state.setting.toJS().mapLegend,
  appConfig: state.appConfig.toJS(),
  mapModules: state.mapModules.toJS(),
  mapColumnNavBar: state.setting.toJS().mapColumnNavBar,
})

const mapDispatchToProps = {
  setSettingData,
  closeMap,
  setMapLegend,
  setColumnNavBar,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MapSetting)

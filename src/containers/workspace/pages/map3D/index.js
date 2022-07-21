import { connect } from 'react-redux'
import Map3D from './Map3D'
import {
  setEditLayer,
  setCurrentAttribute,
  refreshLayer3dList,
  setAttributes,
  resetLayer3dList,
} from '../../../../redux/models/layers'
import {
  setLatestMap,
  setCurrentMap,
  exportmap3DWorkspace,
  importSceneWorkspace,
} from '../../../../redux/models/map'
import { setNavBarDisplay } from '../../../../redux/models/setting'
import { setSharing } from '../../../../redux/models/online'
import {
  setBackAction,
  removeBackAction,
} from '../../../../redux/models/backActions'
import { setToolbarStatus } from '../../../../redux/models/toolbarStatus'
import { setSampleDataShow} from '../../../../redux/models/down'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
  language: state.setting.toJS().language,
  editLayer: state.layers.toJS().editLayer,
  latestMap: state.map.toJS().latestMap,
  user: state.user.toJS(),
  currentAttribute: state.layers.toJS().currentAttribute,
  selection: state.layers.toJS().selection,
  currentLayer: state.layers.toJS().currentLayer,
  attributes: state.layers.toJS().attributes,
  device: state.device.toJS().device,
  online: state.online.toJS(),
  downloads: state.down.toJS().downloads,
  toolbarStatus: state.toolbarStatus.toJS(),
  appConfig: state.appConfig.toJS(),
  mapModules: state.mapModules.toJS(),
  mapColumnNavBar: state.setting.toJS().mapColumnNavBar,
  navBarDisplay: state.setting.toJS().navBarDisplay,
  backActions: state.backActions.toJS(),
  mapSceneGuide: state.home.toJS().mapSceneGuide,
  showSampleData: state.down.toJS().showSampleData,
})

const mapDispatchToProps = {
  setEditLayer,
  setLatestMap,
  setCurrentMap,
  setCurrentAttribute,
  exportmap3DWorkspace,
  importSceneWorkspace,
  setSharing,
  refreshLayer3dList,
  setAttributes,
  setBackAction,
  removeBackAction,
  setToolbarStatus,
  setNavBarDisplay,
  setSampleDataShow,
  resetLayer3dList,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Map3D)

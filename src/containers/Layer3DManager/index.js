import { connect } from 'react-redux'
import Layer3DManager from './Layer3DManager'
import {
  refreshLayer3dList,
  setCurrentLayer3d,
} from '../../redux/models/layers'

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  layer3dList: state.layers.toJS().layer3dList,
  device: state.device.toJS().device,
  currentLayer3d: state.layers.toJS().currentLayer3d,
  appConfig: state.appConfig.toJS(),
  mapModules: state.mapModules.toJS(),
})

const mapDispatchToProps = {
  refreshLayer3dList,
  setCurrentLayer3d,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Layer3DManager)

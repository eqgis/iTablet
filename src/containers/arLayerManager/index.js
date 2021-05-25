import { connect } from 'react-redux'
import ARLayerManager from './ARLayerManager'
import { closeARMap, createARMap, saveARMap } from '../../redux/models/armap'
import { setCurrentARLayer, getARLayers } from '../../redux/models/arlayer'

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  currentUser: state.user.toJS().currentUser,
  arlayer: state.arlayer.toJS(),
  armap: state.armap.toJS(),
  device: state.device.toJS().device,
})

const mapDispatch = {
  setCurrentARLayer,
  getARLayers,
  createARMap,
  saveARMap,
  closeARMap,
}

export default connect(
  mapStateToProps,
  mapDispatch,
)(ARLayerManager)

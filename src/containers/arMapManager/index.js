import { connect } from 'react-redux'
import ARMapManager from './ARMapManager'
import { closeARMap, createARMap, saveARMap } from '../../redux/models/armap'
import { setCurrentARLayer, getARLayers } from '../../redux/models/arlayer'

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  currentUser: state.user.toJS().currentUser,
  arlayer: state.arlayer.toJS(),
  armap: state.armap.toJS(),
  orientation: state.device.toJS().device.orientation,
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
)(ARMapManager)

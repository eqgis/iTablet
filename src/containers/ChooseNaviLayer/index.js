import { connect } from 'react-redux'
import ChooseNaviLayer from './ChooseNaviLayer'
import { setCurrentLayer ,getLayers} from '../../redux/models/layers'

const mapDispatchToProps = {
  setCurrentLayer,
  getLayers,
}

const mapStateToProps = state => ({
  user: state.user.toJS(),
  language: state.setting.toJS().language,
  device: state.device.toJS().device,
  currentLayer: state.layers.toJS().currentLayer,
  layers: state.layers.toJS().layers,
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChooseNaviLayer)

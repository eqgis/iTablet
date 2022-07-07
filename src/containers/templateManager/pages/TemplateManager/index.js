import { connect } from 'react-redux'
import TemplateManager from './TemplateManager'
import { setCurrentMap } from '../../../../redux/models/map'

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  nav: state.nav.toJS(),
  map: state.map.toJS(),
  layers: state.layers.toJS().layers,
  device: state.device.toJS().device,
  currentUser: state.user.toJS().currentUser,
})

const mapDispatchToProps = {
  setCurrentMap,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TemplateManager)

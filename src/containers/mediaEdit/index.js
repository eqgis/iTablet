import { connect } from 'react-redux'
import MediaEdit from './MediaEdit'
import {
  setCurrentLayer,
} from '../../redux/models/layers'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
  language: state.setting.toJS().language,
  user: state.user.toJS(),
  device: state.device.toJS().device,
  currentTask: state.cowork.toJS().currentTask,
})

const mapDispatchToProps = {
  setCurrentLayer,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MediaEdit)

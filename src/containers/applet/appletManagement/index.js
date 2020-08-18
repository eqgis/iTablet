import { connect } from 'react-redux'
import {
  updateDownList,
  removeItemOfDownList,
} from '../../../redux/models/online'
import {
  setMapModule,
} from '../../../redux/models/mapModules'
import AppletManagement from './AppletManagement'

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  device: state.device.toJS().device,
  user: state.user.toJS(),
  down: state.online.toJS().down,
})

const mapDispatchToProps = {
  updateDownList,
  removeItemOfDownList,
  setMapModule,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppletManagement)

import { connect } from 'react-redux'
import NavigationView from './NavigationView'
import {
  setMapNavigation,
  setNavigationHistory,
} from '../../../../redux/models/setting'
import {setSampleDataShow} from '../../../../redux/models/down'

const mapStateToProps = state => ({
  mapNavigation: state.setting.toJS().mapNavigation,
  navigationhistory: state.setting.toJS().navigationhistory,
  device: state.device.toJS().device,
})
const mapDispatchToProps = {
  setMapNavigation,
  setNavigationHistory,
  setSampleDataShow,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavigationView)

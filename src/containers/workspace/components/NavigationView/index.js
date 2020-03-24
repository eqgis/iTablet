import { connect } from 'react-redux'
import NavigationView from './NavigationView'
import {
  setMapNavigation,
  setNavigationHistory,
} from '../../../../models/setting'

const mapStateToProps = state => ({
  mapNavigation: state.setting.toJS().mapNavigation,
  navigationhistory: state.setting.toJS().navigationhistory,
})
const mapDispatchToProps = {
  setMapNavigation,
  setNavigationHistory,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavigationView)

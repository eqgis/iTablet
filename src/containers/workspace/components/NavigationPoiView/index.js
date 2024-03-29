import { connect } from 'react-redux'
import NavigationPoiView from './NavigationPoiView'
import {
  setMapNavigation,
  setNavigationPoiView,
} from '../../../../redux/models/setting'

const mapStateToProps = state => ({
  mapNavigation: state.setting.toJS().mapNavigation,
  navigationPoiView: state.setting.toJS().navigationPoiView,
})
const mapDispatchToProps = {
  setMapNavigation,
  setNavigationPoiView,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavigationPoiView)

import { connect } from 'react-redux'
import PointAnalyst from './pointAnalyst'
import {
  setMapNavigation,
  setNavigationChangeAR,
} from '../../redux/models/setting'
import { setMapSearchHistory } from '../../redux/models/histories'

const mapStateToProps = state => ({
  mapNavigation: state.setting.toJS().mapNavigation,
  navigationChangeAR: state.setting.toJS().navigationChangeAR,
  mapSearchHistory: state.histories.toJS().mapSearchHistory,
})
const mapDispatchToProps = {
  setMapNavigation,
  setNavigationChangeAR,
  setMapSearchHistory,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PointAnalyst)

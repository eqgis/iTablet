import { connect } from 'react-redux'
import AnalystTools from './AnalystTools'
import {
  setBackAction,
  removeBackAction,
} from '../../../../redux/models/backActions'
import { setMapLegend } from '../../../../redux/models/setting'
import { closeMap } from '../../../../redux/models/map'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
  device: state.device.toJS().device,
  language: state.setting.toJS().language,
})
const mapDispatchToProps = {
  setMapLegend,
  setBackAction,
  removeBackAction,
  closeMap,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AnalystTools)

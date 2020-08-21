import { connect } from 'react-redux'
import SampleMap from './SampleMap'
import {
  downloadFile,
  deleteDownloadFile,
} from '../../redux/models/down'

const mapStateToProps = state => ({
  user: state.user.toJS(),
  device: state.device.toJS().device,
  downloads: state.down.toJS().downloads,
  mapModules: state.mapModules.toJS(),
  language: state.setting.toJS().language,
})
const mapDispatchToProps = {
  downloadFile,
  deleteDownloadFile,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SampleMap)
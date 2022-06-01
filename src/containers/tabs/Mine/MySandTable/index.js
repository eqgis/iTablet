import { connect } from 'react-redux'
import MySandTable from './MySandTable'
import { importWorkspace } from '../../../../redux/models/template'
import { setUser } from '../../../../redux/models/user'
import { uploading } from '../../../../redux/models/online'
import { exportWorkspace } from '../../../../redux/models/map'

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  user: state.user.toJS(),
  upload: state.online.toJS().upload,
  device: state.device.toJS().device,
})

const mapDispatchToProps = {
  setUser,
  importWorkspace,
  uploading,
  exportWorkspace,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MySandTable)

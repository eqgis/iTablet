import { connect } from 'react-redux'
import MyApplet from './MyApplet'
import { importWorkspace } from '../../../../redux/models/template'
import { setUser } from '../../../../redux/models/user'
import { uploading } from '../../../../redux/models/online'
import { exportWorkspace } from '../../../../redux/models/map'
import { setMapModule } from '../../../../redux/models/mapModules'

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
  setMapModule,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyApplet)

import { connect } from 'react-redux'
import MyColor from './MyColor'
import { setUser } from '../../../../redux/models/user'
import { uploading } from '../../../../redux/models/online'

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  user: state.user.toJS(),
  upload: state.online.toJS().upload,
  device: state.device.toJS().device,
})

const mapDispatchToProps = {
  setUser,
  uploading,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyColor)

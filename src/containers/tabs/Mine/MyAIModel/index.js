import { connect } from 'react-redux'
import MyAIModel from './MyAIModel'
import { setUser } from '../../../../redux/models/user'
import { uploading } from '../../../../redux/models/online'

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  user: state.user.toJS(),
  device: state.device.toJS().device,
})

const mapDispatchToProps = {
  setUser,
  uploading,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyAIModel)

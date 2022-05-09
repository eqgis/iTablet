import { connect } from 'react-redux'
import ToggleAccount from './ToggleAccount'
import { setUser, deleteUser } from '../../../../redux/models/user'
import { openWorkspace, closeWorkspace } from '../../../../redux/models/map'

const mapStateToProps = state => ({
  user: state.user.toJS(),
  device: state.device.toJS().device,
})

const mapDispatchToProps = {
  setUser,
  deleteUser,
  openWorkspace,
  closeWorkspace,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ToggleAccount)

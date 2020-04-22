import { connect } from 'react-redux'
import ToggleAccount from './ToggleAccount'
import { setUser, deleteUser } from '../../../../redux/models/user'

const mapStateToProps = state => ({
  user: state.user.toJS(),
  device: state.device.toJS().device,
})

const mapDispatchToProps = {
  setUser,
  deleteUser,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ToggleAccount)

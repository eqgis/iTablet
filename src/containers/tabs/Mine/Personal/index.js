import { connect } from 'react-redux'
import Personal from './Personal'
import { setUser, deleteUser } from '../../../../redux/models/user'
import { openWorkspace, closeWorkspace } from '../../../../redux/models/map'

const mapStateToProps = state => ({
  user: state.user.toJS(),
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
)(Personal)

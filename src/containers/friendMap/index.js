import { connect } from 'react-redux'
import FriendMap from './FriendMap'
import { setUser } from '../../redux/models/user'

const mapStateToProps = state => ({
  user: state.user.toJS(),
})
const mapDispatchToProps = {
  setUser,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FriendMap)

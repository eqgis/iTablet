import { connect } from 'react-redux'
import PublicMap from './PublicMap'
import { setUser } from '../../redux/models/user'
import { downloadFile } from '../../redux/models/down'

const mapStateToProps = state => ({
  user: state.user.toJS(),
  downloads: state.down.toJS().downloads,
})
const mapDispatchToProps = {
  setUser,
  downloadFile,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PublicMap)

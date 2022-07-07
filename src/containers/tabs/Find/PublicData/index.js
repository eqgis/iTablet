import { connect } from 'react-redux'
import PublicData from './PublicData'
import {
  updateDownList,
  removeItemOfDownList,
} from '../../../../redux/models/online'

const mapStateToProps = state => ({
  user: state.user.toJS(),
  down: state.online.toJS().down,
})
const mapDispatchToProps = {
  updateDownList,
  removeItemOfDownList,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PublicData)

import { connect } from 'react-redux'
import Applet from './Applet'
import {
  updateDownList,
  removeItemOfDownList,
} from '../../../../redux/models/online'

const mapStateToProps = state => ({
  user: state.user.toJS(),
  down: state.online.toJS().down,
  language: state.setting.toJS().language,
})
const mapDispatchToProps = {
  updateDownList,
  removeItemOfDownList,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Applet)

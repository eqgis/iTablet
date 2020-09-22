import { connect } from 'react-redux'
import Find from './Find'
import { setUser } from '../../../redux/models/user'

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  user: state.user.toJS(),
  find: state.setting.toJS().find,
})

const mapDispatchToProps = {
  setUser,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Find)

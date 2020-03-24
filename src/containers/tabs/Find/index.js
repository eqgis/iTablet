import { connect } from 'react-redux'
import Find from './Find'
import { setUser } from '../../../models/user'

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  user: state.user.toJS(),
})

const mapDispatchToProps = {
  setUser,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Find)

import { connect } from 'react-redux'
import Login from './Login'
import { setUser, loginIPortal, loginOnline } from '../../../../redux/models/user'

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  user: state.user.toJS(),
  appConfig: state.appConfig.toJS(),
})

const mapDispatchToProps = {
  setUser,
  loginIPortal,
  loginOnline,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login)

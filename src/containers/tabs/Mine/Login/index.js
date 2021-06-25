import { connect } from 'react-redux'
import Login from './Login'
import { setUser } from '../../../../redux/models/user'

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  user: state.user.toJS(),
  appConfig: state.appConfig.toJS(),
})

const mapDispatchToProps = {
  setUser,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login)

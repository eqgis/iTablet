import { connect } from 'react-redux'
import Login from './Login'
import { setUser } from '../../../../redux/models/user'
import { setMessageService } from '../../../../redux/models/appConfig'

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  user: state.user.toJS(),
  appConfig: state.appConfig.toJS(),
})

const mapDispatchToProps = {
  setUser,
  setMessageService,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login)

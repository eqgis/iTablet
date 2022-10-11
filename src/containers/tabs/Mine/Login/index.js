import { connect } from 'react-redux'
import Login from './Login'
import { setUser } from '../../../../redux/models/user'
import { setMessageService } from '../../../../redux/models/appConfig'
import { setBaseMap } from '../../../../redux/models/map'

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  user: state.user.toJS(),
  appConfig: state.appConfig.toJS(),
  baseMaps: state.map.toJS().baseMaps,
  device: state.device.toJS().device,
})

const mapDispatchToProps = {
  setUser,
  setMessageService,
  setBaseMap,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login)

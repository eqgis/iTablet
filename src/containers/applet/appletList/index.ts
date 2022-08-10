import { connect } from 'react-redux'
import { setMapModule } from '@/redux/models/mapModules'
import { setOldMapModule } from '@/redux/models/appConfig'
import AppletManagement from './AppletList'

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  device: state.device.toJS().device,
  user: state.user.toJS(),
  appConfig: state.appConfig.toJS(),
  mapModules: state.mapModules.toJS(),
})

const mapDispatchToProps = {
  setMapModule,
  setOldMapModule,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppletManagement)

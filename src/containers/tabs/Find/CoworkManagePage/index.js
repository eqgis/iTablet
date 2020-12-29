import CoworkManagePage from './CoworkManagePage'
import { connect } from 'react-redux'
import { setCurrentMapModule } from '../../../../redux/models/mapModules'
import { deleteInvite, addCoworkMsg, deleteCoworkMsg } from '../../../../redux/models/cowork' 

const mapStateToProps = state => ({
  user: state.user.toJS(),
  appConfig: state.appConfig.toJS(),
  latestMap: state.map.toJS().latestMap,
  device: state.device.toJS().device,
  language: state.setting.toJS().language,
  // cowork: state.cowork.toJS(),
})

const mapDispatchToProps = {
  setCurrentMapModule,
  deleteInvite,
  addCoworkMsg,
  deleteCoworkMsg,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CoworkManagePage)

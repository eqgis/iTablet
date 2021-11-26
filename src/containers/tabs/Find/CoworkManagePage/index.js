import CoworkManagePage from './CoworkManagePage'
import { connect } from 'react-redux'
import { setCurrentMapModule } from '../../../../redux/models/mapModules'
import { deleteInvite, addCoworkMsg, deleteCoworkMsg, readCoworkGroupMsg, setCurrentGroup, deleteGroupTasks } from '../../../../redux/models/cowork' 

const mapStateToProps = state => ({
  user: state.user.toJS(),
  appConfig: state.appConfig.toJS(),
  latestMap: state.map.toJS().latestMap,
  device: state.device.toJS().device,
  language: state.setting.toJS().language,
  currentGroup: state.cowork.toJS().currentGroup,
  // cowork: state.cowork.toJS(),
})

const mapDispatchToProps = {
  setCurrentMapModule,
  deleteInvite,
  addCoworkMsg,
  deleteCoworkMsg,
  readCoworkGroupMsg,
  setCurrentGroup,
  deleteGroupTasks,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CoworkManagePage)

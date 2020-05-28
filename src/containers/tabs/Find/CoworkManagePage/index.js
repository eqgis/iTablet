import CoworkManagePage from './CoworkManagePage'
import { connect } from 'react-redux'
import { setCurrentMapModule } from '../../../../redux/models/mapModules'
import { deleteInvite } from '../../../../redux/models/cowork'

const mapStateToProps = state => ({
  user: state.user.toJS(),
  invites: state.cowork.toJS().invites,
  appConfig: state.appConfig.toJS(),
  latestMap: state.map.toJS().latestMap,
})

const mapDispatchToProps = {
  setCurrentMapModule,
  deleteInvite,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CoworkManagePage)

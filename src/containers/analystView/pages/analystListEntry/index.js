import { connect } from 'react-redux'
import AnalystListEntry from './AnalystListEntry'
// import {
//   setIsAnalyst,
//   setAnalystSuccess,
// } from '../../../../redux/models/map'

import {
  setIsAnalyst,
  setAnalystSuccess,
} from '../../../../redux/models/analyst'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
  currentUser: state.user.toJS().currentUser,
  language: state.setting.toJS().language,
  isAnalyst: state.analyst.toJS().isAnalyst,
  analystSuccess: state.analyst.toJS().analystSuccess,
})
const mapDispatchToProps = {
  setIsAnalyst,
  setAnalystSuccess,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AnalystListEntry)

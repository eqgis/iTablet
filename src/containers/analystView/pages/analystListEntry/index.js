import { connect } from 'react-redux'
import AnalystListEntry from './AnalystListEntry'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
  currentUser: state.user.toJS().currentUser,
  language: state.setting.toJS().language,
})
const mapDispatchToProps = {}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AnalystListEntry)

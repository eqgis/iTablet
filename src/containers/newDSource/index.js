import { connect } from 'react-redux'
import NewDSource from './NewDSource'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
  workspace: state.map.toJS().workspace,
  map: state.map.toJS().map,
  mapControl: state.map.toJS().mapControl,
})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewDSource)

import { connect } from 'react-redux'
import MapLoad from './MapLoad'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
})

export default connect(
  mapStateToProps,
  {},
)(MapLoad)

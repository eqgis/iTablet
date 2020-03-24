import { connect } from 'react-redux'
import MapToolbar from './MapToolbar'

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
})

const mapDispatchToProps = {}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MapToolbar)
// export default MapToolbar

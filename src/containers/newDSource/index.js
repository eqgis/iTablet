import { connect } from 'react-redux'
import NewDSource from './NewDSource'

import { setMapView } from '../../redux/models/map'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
  workspace: state.map.toJS().workspace,
  map: state.map.toJS().map,
  mapControl: state.map.toJS().mapControl,
})

const mapDispatchToProps = {
  setMapView,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewDSource)

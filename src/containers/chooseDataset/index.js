import { connect } from 'react-redux'
import MTDataCollection from './ChooseDataset'

import { setMapView } from '../../models/map'

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
)(MTDataCollection)

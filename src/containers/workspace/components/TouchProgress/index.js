import { connect } from 'react-redux'
import TouchProgress from './TouchProgress'
import { setCurrentAttribute } from '../../../../redux/models/layers'
import { setMapLegend } from '../../../../redux/models/setting'

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  currentLayer: state.layers.toJS().currentLayer,
  mapLegend: state.setting.toJS().mapLegend,
})

const mapDispatchToProps = {
  setCurrentAttribute,
  setMapLegend,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TouchProgress)

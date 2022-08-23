import { connect } from 'react-redux'
import LayerAttributeStatistic from './LayerAttributeStatistic'
import { setCurrentAttribute } from '../../../../redux/models/layers'

const mapStateToProps = state => ({
  currentAttribute: state.layers.toJS().currentAttribute,
  selection: state.layers.toJS().selection,
  language: state.setting.toJS().language,
  device: state.device.toJS().device,
})

const mapDispatchToProps = {
  setCurrentAttribute,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LayerAttributeStatistic)

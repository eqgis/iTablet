import MeasureAreaView from './MeasureAreaView'
import { connect } from 'react-redux'

const mapStateToProp = state => ({
  currentLayer: state.layers.toJS().currentLayer,
  user: state.user.toJS(),
  device: state.device.toJS().device,
})

const mapDispatch = {

}

const connector = connect(mapStateToProp, mapDispatch)

export default connector(MeasureAreaView)
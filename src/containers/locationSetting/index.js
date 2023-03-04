import { connect } from 'react-redux'
import { setDevice } from '../../redux/models/setting'
import LocationSetting from './LocationSetting'
import { setPositionAccuracy } from '../../redux/models/location'

const mapStateToProps = state => ({
  peripheralDevice: state.setting.toJS().peripheralDevice,
  positionAccuracy: state.location.toJS().positionAccuracy,
})
const mapDispatchToProps = {
  setDevice,
  setPositionAccuracy,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LocationSetting)

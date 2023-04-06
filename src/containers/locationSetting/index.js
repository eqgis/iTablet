import { connect } from 'react-redux'
import { setDevice } from '../../redux/models/setting'
import LocationSetting from './LocationSetting'
import { setPositionAccuracy, setDeviceManufacturer, setDeviceType, setDeviceConnectionMode, setBluetoothDeviceInfo, setPositionGGA} from '../../redux/models/location'

const mapStateToProps = state => ({
  peripheralDevice: state.setting.toJS().peripheralDevice,
  positionAccuracy: state.location.toJS().positionAccuracy,
  deviceManufacturer: state.location.toJS().deviceManufacturer,
  deviceType: state.location.toJS().deviceType,
  isOpenBlutooth: state.location.toJS().isOpenBlutooth,
  bluetoohDevice: state.location.toJS().bluetoohDevice,
})
const mapDispatchToProps = {
  setDevice,
  setPositionAccuracy,
  setDeviceManufacturer,
  setDeviceType,
  setDeviceConnectionMode,
  setBluetoothDeviceInfo,
  setPositionGGA,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LocationSetting)

import { RootState } from '../../redux/types'
import { connect } from "react-redux"
import LocationDeviceConnectionMode from './LocationDeviceConnectionMode'
import { setBluetoothDeviceInfo, setDeviceConnectionMode } from '@/redux/models/location'

const mapStateToProp = (state: RootState) => ({
  deviceManufacturer: state.location.toJS().deviceManufacturer,
  isOpenBlutooth: state.location.toJS().isOpenBlutooth,
  bluetoohDevice: state.location.toJS().bluetoohDevice,
})

const mapDispatch = {
  setDeviceConnectionMode,
  setBluetoothDeviceInfo,
}

const connector = connect(mapStateToProp, mapDispatch)

export default connector(LocationDeviceConnectionMode)
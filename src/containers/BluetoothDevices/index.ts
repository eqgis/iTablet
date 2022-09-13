import { RootState } from '../../redux/types'
import { connect } from "react-redux"
import { setDevice } from '../../redux/models/setting'
import BluetoothDevices from './BluetoothDevices'

const mapStateToProp = (state: RootState) => ({
  device: state.device.toJS().device,
  peripheralDevice: state.setting.toJS().peripheralDevice,
})

const mapDispatch = {
  setDevice,
}

const connector = connect(mapStateToProp, mapDispatch)

export default connector(BluetoothDevices)
import { RootState } from '../../redux/types'
import { connect } from "react-redux"
import ExternalDevices from "./ExternalDevices"
import { setDevice } from '../../redux/models/setting'

const mapStateToProp = (state: RootState) => ({
  device: state.device.toJS().device,
  peripheralDevice: state.setting.toJS().peripheralDevice,
})

const mapDispatch = {
  setDevice,
}

const connector = connect(mapStateToProp, mapDispatch)

export default connector(ExternalDevices)
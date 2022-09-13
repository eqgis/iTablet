import { RootState } from '../../redux/types'
import { connect } from "react-redux"
import NtripSetting from './NtripSetting'

const mapStateToProp = (state: RootState) => ({
  device: state.device.toJS().device,
})

const mapDispatch = {
}

const connector = connect(mapStateToProp, mapDispatch)

export default connector(NtripSetting)
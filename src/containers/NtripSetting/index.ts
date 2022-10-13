import { RootState } from '../../redux/types'
import { connect } from "react-redux"
import NtripSetting from './NtripSetting'
import { updateNtripInfo } from '@/redux/models/location'

const mapStateToProp = (state: RootState) => ({
  device: state.device.toJS().device,
  essentialInfo: state.location.toJS().essentialInfo,
  selectLoadPoint: state.location.toJS().selectLoadPoint,
})

const mapDispatch = {
  updateNtripInfo,
}

const connector = connect(mapStateToProp, mapDispatch)

export default connector(NtripSetting)
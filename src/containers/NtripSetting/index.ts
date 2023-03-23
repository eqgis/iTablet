import { RootState } from '../../redux/types'
import { connect } from "react-redux"
import NtripSetting from './NtripSetting'
import { setPositionAgreementType, setPositionServerType, updateNtripInfo } from '@/redux/models/location'

const mapStateToProp = (state: RootState) => ({
  device: state.device.toJS().device,
  essentialInfo: state.location.toJS().essentialInfo,
  selectLoadPoint: state.location.toJS().selectLoadPoint,
  peripheralDevice: state.setting.toJS().peripheralDevice,
  deviceManufacturer: state.location.toJS().deviceManufacturer,
  positionServerType: state.location.toJS().positionServerType,
  // positionAgreementType: state.location.toJS().positionAgreementType,
})

const mapDispatch = {
  updateNtripInfo,
  setPositionServerType,
  // setPositionAgreementType,
}

const connector = connect(mapStateToProp, mapDispatch)

export default connector(NtripSetting)
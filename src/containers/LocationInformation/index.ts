import { RootState } from '../../redux/types'
import { connect } from "react-redux"
import LocationInformation from './LocationInformation'
import { setDeviceManufacturer, setPositionGGA } from '@/redux/models/location'
import { setPointParamShow } from '@/redux/models/setting'

const mapStateToProp = (state: RootState) => ({
  deviceManufacturer: state.location.toJS().deviceManufacturer,
  gga: state.location.toJS().gga,
  isPointParamShow: state.setting.toJS().isPointParamShow,
})

const mapDispatch = {
  setDeviceManufacturer,
  setPositionGGA,
  setPointParamShow,
}

const connector = connect(mapStateToProp, mapDispatch)

export default connector(LocationInformation)
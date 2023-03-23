import { RootState } from '../../redux/types'
import { connect } from "react-redux"
import LocationDevice from './LocationDevice'
import { setDeviceManufacturer } from '@/redux/models/location'

const mapStateToProp = (state: RootState) => ({
  deviceManufacturer: state.location.toJS().deviceManufacturer,
})

const mapDispatch = {
  setDeviceManufacturer,
}

const connector = connect(mapStateToProp, mapDispatch)

export default connector(LocationDevice)
import { RootState } from '../../redux/types'
import { connect } from "react-redux"
import LocationDeviceType from './LocationDeviceType'
import { setDeviceType } from '@/redux/models/location'

const mapStateToProp = (state: RootState) => ({
  deviceType: state.location.toJS().deviceType,
})

const mapDispatch = {
  setDeviceType,
}

const connector = connect(mapStateToProp, mapDispatch)

export default connector(LocationDeviceType)
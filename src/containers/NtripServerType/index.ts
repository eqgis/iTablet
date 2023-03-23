import { RootState } from '../../redux/types'
import { connect } from "react-redux"
import NtripServerType from './NtripServerType'
import { setPositionServerType, } from '@/redux/models/location'

const mapStateToProp = (state: RootState) => ({
  positionServerType: state.location.toJS().positionServerType,
})

const mapDispatch = {
  setPositionServerType,
}

const connector = connect(mapStateToProp, mapDispatch)

export default connector(NtripServerType)
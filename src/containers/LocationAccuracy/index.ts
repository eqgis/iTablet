import { RootState } from '../../redux/types'
import { connect } from "react-redux"
import LocationAccuracy from './LocationAccuracy'
import { setPositionAccuracy, } from '@/redux/models/location'

const mapStateToProp = (state: RootState) => ({
  positionAccuracy: state.location.toJS().positionAccuracy,
})

const mapDispatch = {
  setPositionAccuracy,
}

const connector = connect(mapStateToProp, mapDispatch)

export default connector(LocationAccuracy)
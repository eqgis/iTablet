import AttributeDetail from "./AttributeDetail";
import { RootState } from '../../redux/types'
import { connect } from "react-redux"

const mapStateToProp = (state: RootState) => ({
  device: state.device.toJS().device,
})

const mapDispatch = {
}

const connector = connect(mapStateToProp, mapDispatch)

export default connector(AttributeDetail)
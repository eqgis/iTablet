import { connect } from "react-redux"
import PositionStateView from "./PositionStateView"
import { RootState } from "@/redux/types"

const mapStateToProp = (state: RootState) => ({
  device: state.device.toJS().device,
  pointStateText: state.location.toJS().pointStateText,
})

const mapDispatch = {
}

const connector = connect(mapStateToProp, mapDispatch)

export default connector(PositionStateView)
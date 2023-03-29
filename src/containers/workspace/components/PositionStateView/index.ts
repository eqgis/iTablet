import { connect } from "react-redux"
import PositionStateView from "./PositionStateView"
import { RootState } from "@/redux/types"

const mapStateToProp = (state: RootState) => ({
  device: state.device.toJS().device,
  pointStateText: state.location.toJS().pointStateText,
  isPointParamShow: state.setting.toJS().isPointParamShow,
  gga: state.location.toJS().gga,
})

const mapDispatch = {
}

const connector = connect(mapStateToProp, mapDispatch)

export default connector(PositionStateView)
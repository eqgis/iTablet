import AimPointCollector from "./AimPointCollector"
import { connect } from 'react-redux'
import { RootState } from "@/redux/types"

const mapStateToProps = (state:RootState) => ({
  language: state.setting.toJS().language,
  // device: state.device.toJS().device,
})


const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AimPointCollector)


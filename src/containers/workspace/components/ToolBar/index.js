import ToolBar from './ToolBar'
import { connect } from 'react-redux'

const mapStateToProps = state => {
  return {
    device: state.device.toJS().device,
    windowSize: state.device2.windowSize,
  }
}

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  {
    forwardRef: true,
  },
)(ToolBar)

export { ToolBar }

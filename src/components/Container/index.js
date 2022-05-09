import Container from './Container'
import { connect } from 'react-redux'

const mapStateToProps = state => {
  return {
    device: state.device.toJS().device,
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
)(Container)

export { Container }

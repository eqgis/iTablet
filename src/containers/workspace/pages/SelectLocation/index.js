import SelectLocation  from './SelectLocation.tsx'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
  device: state.device.toJS().device,
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps,mapDispatchToProps,
)(SelectLocation)

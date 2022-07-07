import RegistrationDatasetPage from './RegistrationDatasetPage'
import { connect } from 'react-redux'
import {
    setMapAnalystGuide,
  } from '../../../../redux/models/home'


const mapStateToProps = state => ({
    mapAnalystGuide: state.home.toJS().mapAnalystGuide,
    device: state.device.toJS().device,
})

const mapDispatchToProps = {
    setMapAnalystGuide,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(RegistrationDatasetPage)
import { connect } from 'react-redux'
import ServiceShareSettings from './ServiceShareSettings'
import { setSettingData } from '../../redux/models/setting'

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  user: state.user.toJS(),
  device: state.device.toJS().device,
})

const mapDispatchToProps = {
  setSettingData,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ServiceShareSettings)

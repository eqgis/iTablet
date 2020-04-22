import { connect } from 'react-redux'
import BufferAnalystView from './BufferAnalystView'
import { getLayers } from '../../../../redux/models/layers'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
  device: state.device.toJS().device,
  currentUser: state.user.toJS().currentUser,
  language: state.setting.toJS().language,
})

const mapDispatchToProps = {
  getLayers,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BufferAnalystView)

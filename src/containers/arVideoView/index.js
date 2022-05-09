import { connect } from 'react-redux'
import ARVideoView from './ARVideoView'

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  user: state.user.toJS(),
})

export default connect(
  mapStateToProps,
  [],
)(ARVideoView)

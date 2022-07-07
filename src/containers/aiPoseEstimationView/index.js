import { connect } from 'react-redux'
import AIPoseEstimationView from './AIPoseEstimationView'

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  user: state.user.toJS(),
})

export default connect(
  mapStateToProps,
  [],
)(AIPoseEstimationView)

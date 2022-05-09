import { connect } from 'react-redux'
import AIGestureBoneView from './AIGestureBoneView'

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  user: state.user.toJS(),
})

export default connect(
  mapStateToProps,
  [],
)(AIGestureBoneView)

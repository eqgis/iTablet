import { connect } from 'react-redux'
import Register from './Register'

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
})

const mapDispatchToProps = {}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Register)

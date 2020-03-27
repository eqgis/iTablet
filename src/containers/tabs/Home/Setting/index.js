import { connect } from 'react-redux'
import Setting from './Setting'

const mapStateToProps = state => ({
  appConfig: state.appConfig.toJS(),
})

export default connect(
  mapStateToProps,
  {},
)(Setting)

import { connect } from 'react-redux'
import RegistrationPage from './RegistrationPage'

const mapStateToProps = state => ({
  user: state.user.toJS(),
})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RegistrationPage)

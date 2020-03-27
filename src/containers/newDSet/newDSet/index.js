import { connect } from 'react-redux'
import NewDSet from './NewDSet'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewDSet)

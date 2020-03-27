import { connect } from 'react-redux'
import ThemeStyle from './ThemeStyle'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ThemeStyle)

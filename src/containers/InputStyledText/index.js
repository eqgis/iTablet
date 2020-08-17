import { connect } from 'react-redux'
import InputStyledText from './InputStyledText'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
  language: state.setting.toJS().language,
})

export default connect(
  mapStateToProps,
  [],
)(InputStyledText)

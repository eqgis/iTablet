import { connect } from 'react-redux'
import SearchMine from './SearchMine'

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  user: state.user.toJS(),
})

const mapDispatchToProps = {}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchMine)

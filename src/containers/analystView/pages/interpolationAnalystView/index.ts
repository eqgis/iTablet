import { connect } from 'react-redux'
import InterpolationAnalystView from './InterpolationAnalystView'
import { getLayers } from '../../../../redux/models/layers'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
  currentUser: state.user.toJS().currentUser,
  language: state.setting.toJS().language,
})

const mapDispatchToProps = {
  getLayers,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(InterpolationAnalystView)

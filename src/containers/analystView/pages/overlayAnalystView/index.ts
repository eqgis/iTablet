import { connect } from 'react-redux'
import OverlayAnalystView from './OverlayAnalystView'
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
)(OverlayAnalystView)

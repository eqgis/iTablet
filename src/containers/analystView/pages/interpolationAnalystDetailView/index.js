/**
 * 插值分析 具体插值方法实施界面
 */
import { connect } from 'react-redux'
import InterpolationAnalystDetailView from './InterpolationAnalystDetailView'
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
)(InterpolationAnalystDetailView)

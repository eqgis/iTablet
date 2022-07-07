import { connect } from 'react-redux'
import RefrenceAnalystView from './ReferenceAnalystView'
import { getLayers, setSelection } from '../../../../redux/models/layers'
import { setAnalystParams } from '../../../../redux/models/analyst'
import { setBackAction } from '../../../../redux/models/backActions'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
  currentUser: state.user.toJS().currentUser,
  language: state.setting.toJS().language,
  map: state.map.toJS(),
  layers: state.layers.toJS().layers,
  selection: state.layers.toJS().selection,
})

const mapDispatchToProps = {
  getLayers,
  setSelection,
  setAnalystParams,
  setBackAction,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RefrenceAnalystView)

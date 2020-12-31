import { connect } from 'react-redux'
import ClassifyView from './ClassifyView'

import {
  setIsClassifyView,
} from '../../redux/models/ar'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
  language: state.setting.toJS().language,
  user: state.user.toJS(),
  currentLayer: state.layers.toJS().currentLayer,
  isClassifyView: state.ar.toJS().isClassifyView,
})

const mapDispatchToProps = {
  setIsClassifyView,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClassifyView)

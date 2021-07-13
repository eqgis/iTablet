import { connect } from 'react-redux'
import Camera from './Camera'
import {
  setBackAction,
  removeBackAction,
} from '../../redux/models/backActions'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
  language: state.setting.toJS().language,
  user: state.user.toJS(),
  currentLayer: state.layers.toJS().currentLayer,
})

export default connect(
  mapStateToProps,
  [
    setBackAction,
    removeBackAction,
  ],
)(Camera)

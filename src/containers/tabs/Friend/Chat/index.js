import { connect } from 'react-redux'
import Chat from './Chat'
import {
  setBackAction,
  removeBackAction,
} from '../../../../redux/models/backActions'
import { closeMap } from '../../../../redux/models/map'
import { getLayers } from '../../../../redux/models/layers'

const mapStateToProps = state => ({
  latestMap: state.map.toJS().latestMap,
  appConfig: state.appConfig.toJS(),
  device: state.device.toJS().device,
})

const mapDispatchToProps = {
  setBackAction,
  removeBackAction,
  closeMap,
  getLayers,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Chat)

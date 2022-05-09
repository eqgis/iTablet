import { connect } from 'react-redux'
import Chat from './Chat'
import {
  setBackAction,
  removeBackAction,
} from '../../../../redux/models/backActions'
import { closeMap } from '../../../../redux/models/map'
import { getLayers } from '../../../../redux/models/layers'
import { readCoworkGroupMsg } from '../../../../redux/models/cowork'

const mapStateToProps = state => ({
  latestMap: state.map.toJS().latestMap,
  appConfig: state.appConfig.toJS(),
  device: state.device.toJS().device,
  currentTask: state.cowork.toJS().currentTask,
})

const mapDispatchToProps = {
  setBackAction,
  removeBackAction,
  closeMap,
  getLayers,
  readCoworkGroupMsg,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Chat)

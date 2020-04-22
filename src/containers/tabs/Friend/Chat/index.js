import { connect } from 'react-redux'
import Chat from './Chat'
import {
  setBackAction,
  removeBackAction,
} from '../../../../redux/models/backActions'
import { closeWorkspace } from '../../../../redux/models/map'
import { getLayers } from '../../../../redux/models/layers'

const mapDispatchToProps = {
  setBackAction,
  removeBackAction,
  closeWorkspace,
  getLayers,
}

export default connect(
  null,
  mapDispatchToProps,
)(Chat)

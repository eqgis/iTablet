import { connect } from 'react-redux'
import Chat from './Chat'
import { setBackAction, removeBackAction } from '../../../../models/backActions'
import { closeWorkspace } from '../../../../models/map'
import { getLayers } from '../../../../models/layers'

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

import { connect } from 'react-redux'
import WorkspaceFileList from './WorkspaceFileList'
import {
  setEditLayer,
  setSelection,
  setAnalystLayer,
} from '../../redux/models/layers'
import { setBufferSetting, setOverlaySetting } from '../../redux/models/setting'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
  user: state.user.toJS(),
})

const mapDispatchToProps = {
  setEditLayer,
  setSelection,
  setBufferSetting,
  setOverlaySetting,
  setAnalystLayer,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WorkspaceFileList)

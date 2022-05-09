import { connect } from 'react-redux'
import MyLocalData from './MyLocalData'
import {
  importPlotLib,
  importWorkspace,
} from '../../../../redux/models/template'
import { importSceneWorkspace } from '../../../../redux/models/map'
import {
  updateDownList,
  removeItemOfDownList,
} from '../../../../redux/models/online'
import { setUser } from '../../../../redux/models/user'
import { setImportItem } from '../../../../redux/models/externalData'

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  user: state.user.toJS(),
  down: state.online.toJS().down,
  device: state.device.toJS().device,
  importItem: state.externalData.toJS().importItem,
})

const mapDispatchToProps = {
  setUser,
  importPlotLib,
  importWorkspace,
  importSceneWorkspace,
  updateDownList,
  removeItemOfDownList,
  setImportItem,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyLocalData)

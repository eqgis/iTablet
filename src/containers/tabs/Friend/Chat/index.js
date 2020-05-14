import { connect } from 'react-redux'
import Chat from './Chat'
import {
  setBackAction,
  removeBackAction,
} from '../../../../redux/models/backActions'
import { closeMap } from '../../../../redux/models/map'
import { getLayers } from '../../../../redux/models/layers'
import { setCurrentMapModule } from '../../../../redux/models/appConfig'

const mapStateToProps = state => ({
  latestMap: state.map.toJS().latestMap,
  appConfig: state.appConfig.toJS(),
})

const mapDispatchToProps = {
  setBackAction,
  removeBackAction,
  closeMap,
  getLayers,
  setCurrentMapModule,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Chat)

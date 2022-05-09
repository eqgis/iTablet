import { connect } from 'react-redux'
import LocalAnalystView from './LocalAnalystView'
import { getLayers, setCurrentLayer } from '../../../../redux/models/layers'
import { setAnalystParams } from '../../../../redux/models/analyst'
import { getUdbAndDs } from '../../../../redux/models/localData'
import { closeMap } from '../../../../redux/models/map'

const mapStateToProps = state => ({
  nav: state.nav.toJS(),
  currentUser: state.user.toJS().currentUser,
  language: state.setting.toJS().language,
  userUdbAndDs: state.localData.toJS().userUdbAndDs,
  device: state.device.toJS().device,
})

const mapDispatchToProps = {
  getLayers,
  setCurrentLayer,
  setAnalystParams,
  getUdbAndDs,
  closeMap,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LocalAnalystView)

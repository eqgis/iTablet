import { connect } from 'react-redux'
import MyService from './MyService'
import { setUser } from '../../../../redux/models/user'
import { setBaseMap } from '../../../../redux/models/map'

const mapStateToProps = state => ({
  user: state.user.toJS(),
  device: state.device.toJS().device,
  baseMaps: state.map.toJS().baseMaps,
})

const mapDispatchToProps = {
  setUser,
  setBaseMap,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyService)

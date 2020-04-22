import { connect } from 'react-redux'
import MyBaseMap from './MyBaseMap'
import { setBaseMap } from '../../../../redux/models/map'

const mapStateToProps = state => ({
  baseMaps: state.map.toJS().baseMaps,
  user: state.user.toJS(),
})
const mapDispatchToProps = {
  setBaseMap,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyBaseMap)

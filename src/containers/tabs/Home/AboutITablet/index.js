import { connect } from 'react-redux'
import AboutITablet from './AboutITablet'
import {
  setGuideShow
} from '../../../../redux/models/home'
import {
  setMapArGuide,
  setMapArMappingGuide,
} from '../../../../redux/models/ar'

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  device: state.device.toJS().device,
})
const mapDispatchToProps = {
  setGuideShow,
  setMapArGuide,
  setMapArMappingGuide,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AboutITablet)

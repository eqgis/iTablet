import { connect } from 'react-redux'
import AboutITablet from './AboutITablet'
import {
  setGuideShow,
  setMapAnalystGuide,
  setThemeGuide,
  setCollectGuide,
  setMapEditGuide,
  setMapSceneGuide,
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
  setMapAnalystGuide,
  setThemeGuide,
  setCollectGuide,
  setMapEditGuide,
  setMapSceneGuide,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AboutITablet)

import GuideViewMapThemeModel from './GuideViewMapThemeModel'
import { connect } from 'react-redux'
import {
  setMapArGuide,
  setMapArMappingGuide,
} from '../../../../redux/models/ar'

import {
  setThemeGuide,
} from '../../../../redux/models/home'

const mapStateToProps = state => ({
    mapArGuide: state.ar.toJS().mapArGuide,
    mapArMappingGuide: state.ar.toJS().mapArMappingGuide,
  })

const mapDispatchToProps = {
  setMapArGuide,
  setMapArMappingGuide,
  setThemeGuide,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
  )(GuideViewMapThemeModel)
import GuideViewMapArMappingModel from './GuideViewMapArMappingModel'
import { connect } from 'react-redux'
import {
  setMapArGuide,
  setMapArMappingGuide,
} from '../../../../redux/models/ar'

const mapStateToProps = state => ({
    mapArGuide: state.ar.toJS().mapArGuide,
    mapArMappingGuide: state.ar.toJS().mapArMappingGuide,
  })

const mapDispatchToProps = {
  setMapArGuide,
  setMapArMappingGuide,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
  )(GuideViewMapArMappingModel)
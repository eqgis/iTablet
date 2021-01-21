import GuideViewMapAnalystModel from './GuideViewMapAnalystModel'
import { connect } from 'react-redux'
import {
  setMapAnalystGuide,
} from '../../../../redux/models/home'

const mapStateToProps = state => ({
  mapAnalystGuide: state.home.toJS().mapAnalystGuide,
  })

const mapDispatchToProps = {
  setMapAnalystGuide,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
  )(GuideViewMapAnalystModel)
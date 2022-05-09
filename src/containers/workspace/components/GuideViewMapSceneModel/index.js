import GuideViewMapSceneModel from './GuideViewMapSceneModel'
import { connect } from 'react-redux'
import {
  setMapSceneGuide,
} from '../../../../redux/models/home'

const mapStateToProps = state => ({

})

const mapDispatchToProps = {
  setMapSceneGuide,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GuideViewMapSceneModel)
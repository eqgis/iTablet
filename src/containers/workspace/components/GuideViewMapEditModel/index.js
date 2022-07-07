import GuideViewMapEditModel from './GuideViewMapEditModel'
import { connect } from 'react-redux'
import {
  setMapEditGuide,
} from '../../../../redux/models/home'

const mapStateToProps = state => ({

})

const mapDispatchToProps = {
  setMapEditGuide,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GuideViewMapEditModel)
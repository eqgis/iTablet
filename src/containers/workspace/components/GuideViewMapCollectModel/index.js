import GuideViewMapCollectModel from './GuideViewMapCollectModel'
import { connect } from 'react-redux'

import {
  setCollectGuide,
} from '../../../../redux/models/home'

const mapStateToProps = state => ({
  })

const mapDispatchToProps = {
  setCollectGuide,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
  )(GuideViewMapCollectModel)
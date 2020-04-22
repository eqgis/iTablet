/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */

import { connect } from 'react-redux'
import SecondMapSettings from './SecondMapSettings'
import { setMapScaleView } from '../../../redux/models/setting'

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  device: state.device.toJS().device,
  mapScaleView: state.setting.toJS().mapScaleView,
})

const mapDispatchToProps = {
  setMapScaleView,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SecondMapSettings)

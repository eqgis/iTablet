/**
 * @description
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */
import { connect } from 'react-redux'
import PreViewColorPicker from './PreViewColorPicker'
const mapStateToProps = state => ({
  device: state.device.toJS().device,
})

export default connect(mapStateToProps)(PreViewColorPicker)
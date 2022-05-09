/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import {connect} from 'react-redux'

import NavigationDataChangePage from './NavigationDataChangePage'

const mapStateToProps = state => ({
  device: state.device.toJS().device,
})

export default connect(
  mapStateToProps,
)(NavigationDataChangePage)

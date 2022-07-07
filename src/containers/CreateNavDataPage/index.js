/**
 * @description
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */
import { connect } from 'react-redux'
import CreateNavDataPage from "./CreateNavDataPage"

const mapStateToProps = state => ({
  device: state.device.toJS().device,
  currentUser: state.user.toJS().currentUser,
})

export default connect(
  mapStateToProps,
)(CreateNavDataPage)
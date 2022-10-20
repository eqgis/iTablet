import PipeLineAttribute from "./PipeLineAttribute"

import { connect } from 'react-redux'
import { RootState } from '@/redux/types'
import { setPipeLineAttribute } from "@/redux/models/arattribute"

const mapStateToProp = (state: RootState) => ({
  device: state.device.toJS().device,
  pipeLineAttribute: state.arattribute.pipeLineAttribute,
})

const mapDispatch = {
  setPipeLineAttribute,
}

const connector = connect(mapStateToProp, mapDispatch)

export default connector(PipeLineAttribute)

// export default PipeLineAttribute
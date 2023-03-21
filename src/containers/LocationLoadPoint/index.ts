import { RootState } from '../../redux/types'
import { connect } from "react-redux"
import LocationLoadPoint from './LocationLoadPoint'

const mapStateToProp = (state: RootState) => ({
})

const mapDispatch = {
}

const connector = connect(mapStateToProp, mapDispatch)

export default connector(LocationLoadPoint)
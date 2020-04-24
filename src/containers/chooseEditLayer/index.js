import { connect } from 'react-redux'
import ChooseEditLayer from './ChooseEditLayer'
import { setEditLayer } from '../../redux/models/layers'

const mapStateToProps = state => ({
  editLayer: state.layers.toJS().editLayer,
})

const mapDispatchToProps = {
  setEditLayer,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChooseEditLayer)

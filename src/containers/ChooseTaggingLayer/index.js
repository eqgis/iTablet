import { connect } from 'react-redux'
import ChooseTaggingLayer from './ChooseTaggingLayer'
import { setCurrentLayer } from '../../redux/models/layers'

const mapDispatchToProps = {
  setCurrentLayer,
}

const mapStateToProps = state => ({
  user: state.user.toJS(),
  language: state.setting.toJS().language,
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChooseTaggingLayer)

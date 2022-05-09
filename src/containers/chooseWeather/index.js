import { connect } from 'react-redux'
import ChooseWeather from './ChooseWeather'
import { downloadFile } from '../../redux/models/down'

const mapStateToProps = state => ({
  downloads: state.down.toJS().downloads,
})

const mapDispatchToProps = {
  downloadFile,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChooseWeather)

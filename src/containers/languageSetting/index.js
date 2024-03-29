import { connect } from 'react-redux'
import { setLanguage } from '../../redux/models/setting'
import LanguageSetting from './LanguageSetting'

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  autoLanguage: state.setting.toJS().autoLanguage,
  appConfig: state.appConfig.toJS(),
})
const mapDispatchToProps = {
  setLanguage,
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LanguageSetting)

import { connect, ConnectedProps } from 'react-redux'
import { FiltedData } from "imobile_for_reactnative"
import { MyDataPage } from '../component'
import { getLanguage } from '../../../../language'
import DataHandler from '../DataHandler'
import { FileTools } from '../../../../native'
import { ConstPath } from '../../../../constants'

class MyARModel extends MyDataPage {
  props: {
    language: string,
    user: {
      currentUser: UserInfo,
      users: UserInfo[],
    },
    arlayer: ARMapInfo,
    armap: ARMapState,
    navigation: any,
    device: Object,
  }

  constructor(props){
    super(props)
    this.dataType = 'ARMODEL'
    this.type = this.types.armodel
    if(this.props.navigation.state.params?.showMode) {
      this.showMode = this.props.navigation.state.params.showMode
    }
    if(this.props.navigation.state.params?.title) {
      this.title = this.props.navigation.state.params.title
    } else {
      this.title = getLanguage(this.props.language).Profile.ARMODEL
    }
    this.state = {
      ...this.state,
      title: getLanguage(GLOBAL.language).Profile.ARMAP,
      shareToLocal: true,
      shareToOnline: true,
      shareToIPortal: true,
      shareToWechat: true,
      shareToFriend: true,
      showFullInMap: true,
    }
  }

  getData = async () => {
    let data = await DataHandler.getLocalData(
      this.props.user.currentUser,
      'ARMODEL',
    )

    let sectionData = []
    sectionData.push({
      title: 'ARMODEL',
      data: data || [],
      isShowItem: true,
    })
    return sectionData
  }

  // onItemPress = item => {
  //   AppToolBar.show('ARMAP','AR_MAP_ADD_MODEL')
  //   AppToolBar.addData({
  //     modelPath: item.path
  //   })
  //   this.props.navigation.goBack()
  // }

  deleteData = async () => {
    if (!this.itemInfo) return false
    let mapPath = await FileTools.appendingHomeDirectory(
      this.itemInfo.item.path,
    )
    let result = await FileTools.deleteFile(mapPath)

    return result
  }

  //新增参数template判断导出地图是否为模版
  exportData = async name => {
    if (!this.itemInfo) return false
    const homePath = await FileTools.appendingHomeDirectory()
    let path = `${homePath + ConstPath.ExternalData}/`

    const availableName = await DataHandler.getAvailableFileName(path, name, 'zip')

    const exportResult = await FileTools.zipFiles([homePath + this.itemInfo.item.path], path + availableName)

    return exportResult
  }
}

const mapStateToProp = state => ({
  language: state.setting.toJS().language,
  user: state.user.toJS(),
  arlayer: state.arlayer.toJS(),
  armap: state.armap.toJS(),
  device: state.device.toJS().device,
})

const mapDispatch = {}

const connector = connect(mapStateToProp, mapDispatch)

export default connector(MyARModel)
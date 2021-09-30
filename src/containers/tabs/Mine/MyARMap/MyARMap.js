import { connect } from 'react-redux'
import { MyDataPage } from '../component'
import { openARMap, createARMap, ARMapState } from '../../../../redux/models/armap'
import { getARLayers, ARMapInfo } from '../../../../redux/models/arlayer'
import { UserInfo } from '../../../../redux/models/user'
import { SARMap } from 'imobile_for_reactnative'
import { Toast } from '../../../../utils'
import { getLanguage } from '../../../../language'
import DataHandler from '../DataHandler'
import ToolbarModule from '../../../workspace/components/ToolBar/modules/ToolbarModule'
import { FileTools, RNFS } from '../../../../native'
import { ConstPath } from '../../../../constants'
import cheerio from 'react-native-cheerio'

class MyARMap extends MyDataPage {
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

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.type = this.types.armap
    this.showMore = !!params?.showMore
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
    if (!this.showMore) {
      this.getItemCallback = this._getItemCallback
    }
  }

  getData = async () => {
    let data = await DataHandler.getLocalData(
      this.props.user.currentUser,
      'ARMAP',
    )

    let sectionData = []
    sectionData.push({
      title: 'ARMAP',
      data: data || [],
      isShowItem: true,
    })
    return sectionData
  }

  _getItemCallback = ({item}) => {
    GLOBAL.SimpleDialog.set({
      text: getLanguage(GLOBAL.language).Prompt.OPEN_MAP_CONFIRM,
      confirmAction: () => {
        const mapName = item.name.substring(0, item.name.lastIndexOf('.'))
        if(this.props.armap.currentMap?.mapName === mapName) {
          Toast.show(getLanguage(GLOBAL.language).Prompt.THE_MAP_IS_OPENED)
        } else {
          this.openMap(item).then(result => {
            if(result) {
              this.props.navigation.goBack()
            } else {
              Toast.show(getLanguage(GLOBAL.language).Prompt.CHANGE_FAULT)
            }
          })
        }
      },
    })
    GLOBAL.SimpleDialog.setVisible(true)
  }

  openMap = async item => {
    try {
      await SARMap.close()
      await DataHandler.closeARRawDatasource()
      const mapName = item.name.substring(0, item.name.lastIndexOf('.'))
      const result = await this.props.openARMap(mapName)
      if(result) {
        await this.props.getARLayers()
        ToolbarModule.addData({
          addNewDSourceWhenCreate: true,
        })
      }
      return result
    } catch (e) {
      return false
    }
  }

  deleteData = async () => {
    try {
      if (!this.itemInfo) return false
      let mapPath = await FileTools.appendingHomeDirectory(
        this.itemInfo.item.path,
      )

      const mapXml = await RNFS.readFile(mapPath)
      const $ = cheerio.load(mapXml)
      const nodes = $('DatasourceServer')
      const datasourceArr = []
      for(let i = 0; i < nodes.length; i++) {
        const datasourceNode = nodes[i].children[0]
        const datasource = datasourceNode
        let udbPath = datasource.nodeValue
        // 若是相对路径，则补全绝对路径
        if ((udbPath + '').startsWith(ConstPath.AppPath)) {
          udbPath = await FileTools.appendingHomeDirectory(udbPath)
        }
        datasourceArr.push(udbPath)
        const uddPath = udbPath.slice(0, udbPath.length - 1) + 'd'
        datasourceArr.push(uddPath)
      }
      let result = await FileTools.deleteFile(mapPath)
      if(result) {
        datasourceArr.map(item => {
          FileTools.deleteFile(item)
        })
      }

      return result
    } catch (error) {
      return false
    }
  }

  exportData = async name => {
    if (!this.itemInfo) return false
    const homePath = await FileTools.appendingHomeDirectory()
    let path = `${homePath + ConstPath.ExternalData}/`

    const availableName = await DataHandler.getAvailableFileName(
      path,
      name,
      'zip'
    )

    this.exportPath = path + availableName

    const exportResult = await DataHandler.exportARMap(this.itemInfo.item.name, path + availableName)

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

const mapDispatch = {
  openARMap,
  createARMap,
  getARLayers,
}

// type ReduxProps = ConnectedProps<typeof connector>
const connector = connect(mapStateToProp, mapDispatch)

export default connector(MyARMap)
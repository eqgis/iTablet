import { MyDataPage } from '../component'
import { getLanguage } from '../../../../language'
import { ConstPath } from '../../../../constants'
import { BundleTools, FileTools } from 'imobile_for_reactnative'
import PropTypes from 'prop-types'

class MyApplet extends MyDataPage {
  static propTypes = {
    language: PropTypes.string,

    setMapModule: PropTypes.func,
    deleteMapModule: PropTypes.func,
    loadAddedModule: PropTypes.func,
  }
  constructor(props) {
    super(props)
    this.type = this.types.applet
    this.state = {
      ...this.state,
      showSectionHeader: true,
      shareToLocal: true,
      batchMode: false, // 1是批量添加，2是批量删除
      title: getLanguage(this.props.language).Find.APPLET,
    }
    let { params } = this.props.route
    if (params) {
      this.refresh = params.refresh
    }
  }

  getData = async () => {
    const unusedModules = await BundleTools.getUnusedBundles()
    // const assetsModules = await BundleTools.getAssetsBundles()
    const files = await BundleTools.getBundles()
    const _files = []
    for (const file of files) {
      if (file.name !== 'iTablet') {
        _files.push(file)
      }
    }


    const sectionData = []
    sectionData.push({
      title: getLanguage(this.props.language).Profile.MY_APPLET,
      data: _files || [],
      isShowItem: true,
    })
    sectionData.push({
      title: getLanguage(this.props.language).Profile.LOCAL_APPLET,
      data: unusedModules || [],
      isShowItem: true,
    })
    return sectionData
  }

  // 不显示右上角更多按钮
  _renderHeaderRight = () => null

  getCustomItemPopupData = () => {
    if (!this.itemInfo) return []
    let item = this.itemInfo.item
    let _sectionData = JSON.parse(JSON.stringify(this.state.sectionData))
    let sectionIndex = -1
    for (let i in _sectionData) {
      if (this.itemInfo.section.title === _sectionData[i].title) {
        sectionIndex = parseInt(i)
        break
      }
    }
    if (sectionIndex === 1) {
      return [
        {
          title: getLanguage(this.props.language).Profile.ADD_APPLET,
          action: async () => {
            this._closeModal()
            const result = await BundleTools.loadModel(item.path)
            if (result) {
              // 如已经加载过,则从redux记录中直接放到首页
              this.props.loadAddedModule(result.name)
              this._getSectionData()
              this.refresh?.()
            }
          },
        },
      ]
    }
    return []
  }

  deleteData = async () => {
    try {
      this._closeModal()
      let _sectionData = JSON.parse(JSON.stringify(this.state.sectionData))
      let sectionIndex = -1
      for (let i in _sectionData) {
        if (this.itemInfo.section.title === _sectionData[i].title) {
          sectionIndex = parseInt(i)
          break
        }
      }
      // 删除bundle
      let result = false
      if (sectionIndex) {
        // 删除本地小程序
        result = await BundleTools.deleteBundle(this.itemInfo.item.path)
      } else {
        // 卸载已加载的小程序
        result = await BundleTools.unloadBundle(this.itemInfo.item.path)
      }
      if (result) {
        this._getSectionData()
        this.props.deleteMapModule(this.itemInfo.item.name)
        this.refresh?.()
      }
      return true
    } catch (e) {
      return false
    }
  }

  getCommonPagePopupData = () => [
    {
      title: getLanguage(this.props.language).Profile.BATCH_ADD,
      action: () => {
        this.setState({
          batchMode: 1,
        })
      },
    },
    {
      title: getLanguage(this.props.language).Profile.BATCH_DELETE,
      action: () => {
        this.setState({
          batchMode: 2,
        })
      },
    },
  ]

  exportData = async () => {
    try {
      this.exportPath = ''
      if (this.itemInfo?.item?.path) {
        const toPath = await FileTools.appendingHomeDirectory(ConstPath.ExternalData + '/' + ConstPath.RelativeFilePath.ExportBundle)
        this.exportPath = await BundleTools.exportBundles(this.itemInfo.item.path, toPath)
      }
      return !!this.exportPath
    } catch (e) {
      // eslint-disable-next-line no-undef
      __DEV__ && console.warn(e)
      return false
    }
  }
}

export default MyApplet

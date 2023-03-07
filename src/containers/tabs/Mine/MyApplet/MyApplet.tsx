import React from 'react'
import { MyDataPage } from '../component'
import { getLanguage } from '../../../../language'
import { ConstPath } from '../../../../constants'
import { BundleTools, FileTools } from 'imobile_for_reactnative'
import PropTypes from 'prop-types'
import { MTBtn } from '@/components'
import NavigationService from '@/containers/NavigationService'
import { scaleSize } from '@/utils'
import { getImage } from '@/assets'
import styles from '../styles'

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
      shareToWechat: false,
      batchMode: false, // 1是批量添加，2是批量删除
      title: getLanguage(this.props.language).Find.APPLET,
    }
    const { params } = this.props.route
    if (params) {
      this.refresh = params.refresh
    }
  }

  getData = async () => {
    const unusedModules = await BundleTools.getUnusedBundles()
    // const assetsModules = await BundleTools.getAssetsBundles()
    const files = await BundleTools.getBundles(this.props.user.currentUser.userName)
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
  _renderHeaderRight = () => {
    const size = this.props.device.orientation.indexOf('LANDSCAPE') === 0 ? 40 : 50
    return (
      <MTBtn
        key={'applet'}
        style={styles.headerBtn}
        imageStyle={{ width: scaleSize(size), height: scaleSize(size) }}
        image={getImage().my_applets}
        onPress={async () => {
          NavigationService.navigate('AppletOnline', { cb: this._getSectionData })
        }}
      />
    )
  }

  getCustomItemPopupData = () => {
    if (!this.itemInfo) return []
    const item = this.itemInfo.item
    const _sectionData = JSON.parse(JSON.stringify(this.state.sectionData))
    const sectionIndex = -1
    for (const i in _sectionData) {
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
            const result = await BundleTools.loadModel(this.props.user.currentUser.userName, item.path)
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

  getSectionIndex = () => {
    const _sectionData = JSON.parse(JSON.stringify(this.state.sectionData))
    let sectionIndex = -1
    for (let i in _sectionData) {
      if (this.itemInfo.section.title === _sectionData[i].title) {
        sectionIndex = parseInt(i)
        break
      }
    }
    return sectionIndex
  }

  deleteData = async () => {
    try {
      this._closeModal()
      const sectionIndex = this.getSectionIndex()
      // 删除bundle
      let result = false
      if (sectionIndex) {
        // 删除本地小插件
        result = await BundleTools.deleteBundle(this.itemInfo.item.path)
      } else {
        // 卸载已加载的小插件
        result = await BundleTools.unloadBundle(this.props.user.currentUser.userName, this.itemInfo.item.path)
        // 卸载后,删除首页对应小插件
        result && this.props.deleteMapModule(this.itemInfo.item.name)
      }
      if (result) {
        this._getSectionData()
        this.refresh?.()
      }
      return result
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
      const sectionIndex = this.getSectionIndex()
      let result = false
      if (sectionIndex) {
        // 导出本地小插件
        const targetPath = await FileTools.appendingHomeDirectory(ConstPath.ExternalData + '/' + ConstPath.RelativeFilePath.ExportBundle + this.itemInfo.item.name + '.zip', true)
        result = await FileTools.copyFile(this.itemInfo.item.path, targetPath)
      } else {
        // 导出已加载的小插件
        const toPath = await FileTools.appendingHomeDirectory(ConstPath.ExternalData + '/' + ConstPath.RelativeFilePath.ExportBundle)
        this.exportPath = await BundleTools.exportBundles(this.itemInfo.item.path, toPath)
        result = !!this.exportPath
      }
      return result
    } catch (e) {
      // eslint-disable-next-line no-undef
      __DEV__ && console.warn(e)
      return false
    }
  }
}

export default MyApplet

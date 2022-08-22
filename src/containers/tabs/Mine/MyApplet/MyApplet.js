import React from 'react'
import { MyDataPage } from '../component'
import { getLanguage } from '../../../../language'
import { ConstPath } from '../../../../constants'
import { BundleTools, FileTools } from 'imobile_for_reactnative'
import styles from './styles'

class MyApplet extends MyDataPage {
  props: {
    setMapModule: () => void,
    deleteMapModule: () => void,
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

  // setApplets = sectionData => {
  //   this.setState({
  //     sectionData: sectionData,
  //   })
  //   let applets = [] // redux使用的对象数组
  //   let _applets = [] // 本地文件的字符串数组

  //   // 添加系统默认模块
  //   Object.keys(ChunkType).map(key => {
  //     for (let i = 0; i < mapModules.length; i++) {
  //       if (ChunkType[key] === mapModules[i].key) {
  //         applets.push(mapModules[i])
  //         _applets.push(mapModules[i].key)
  //       }
  //     }
  //   })

  //   // 添加自定义已添加小程序
  //   sectionData[0].data.map(item => {
  //     for (let i = 0; i < mapModules.length; i++) {
  //       if (item.name === mapModules[i].key) {
  //         applets.push(mapModules[i])
  //         _applets.push(mapModules[i].key)
  //       }
  //     }
  //   })
  //   this.props.setMapModule(applets)
  //   ConfigUtils.recordApplets(this.props.user.currentUser.userName, _applets)
  // }

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
          title: getLanguage(global.language).Profile.ADD_APPLET,
          action: async () => {
            this._closeModal()
            const result = await BundleTools.loadModel(item.path)
            if (result) {
              this._getSectionData()
              this.refresh?.()
            }
          },
        },
      ]
    }
    return []
  }

  // isShowCheck = info => {
  //   let sectionIndex = -1
  //   for (let i in this.state.sectionData) {
  //     if (info.section.title === this.state.sectionData[i].title) {
  //       sectionIndex = parseInt(i)
  //       break
  //     }
  //   }
  //   if (this.state.batchMode === 1) {
  //     return sectionIndex === 1
  //   } else if (this.state.batchMode === 2) {
  //     return sectionIndex === 0
  //   } else {
  //     return false
  //   }
  // }

  // selectAll = () => {
  //   let section = this.state.sectionData.clone()
  //   let j = 0
  //   let s = []
  //   switch (this.state.batchMode) {
  //     case 1:
  //       s = section[1]
  //       break
  //     case 2:
  //       s = section[0]
  //       break
  //   }
  //   for (let n = 0; n < s.data.length; n++) {
  //     s.data[n].checked = true
  //     j++
  //   }
  //   this.setState({ section, selectedNum: j })
  // }

  deleteData = async () => {
    try {
      this._closeModal()
      // 删除bundle
      const result = await BundleTools.deleteBundle(this.itemInfo.item.path)
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

  // addData = async () => {
  //   try {
  //     let index = 0
  //     for (let i in this.state.sectionData[1].data) {
  //       if (
  //         this.itemInfo.item.name === this.state.sectionData[1].data[i].name
  //       ) {
  //         index = parseInt(i)
  //         break
  //       }
  //     }
  //     let _sectionData = JSON.parse(JSON.stringify(this.state.sectionData))
  //     let _section1 = _sectionData[0]
  //     let _section2 = _sectionData[1]
  //     this._closeModal()
  //     _section2.data.splice(index, 1)
  //     let item = Object.assign({}, this.itemInfo.item)
  //     delete item.checked
  //     _section1.data.push(item)
  //     this.setApplets(_sectionData)
  //     return true
  //   } catch (e) {
  //     return false
  //   }
  // }

  /**
   * 批量添加
   * @returns {Promise.<void>}
   */
  // batchAdd = async () => {
  //   try {
  //     let addArr = this._getSelectedList()
  //     let _sectionData = JSON.parse(JSON.stringify(this.state.sectionData))
  //     let _section1 = _sectionData[0]
  //     let _section2 = _sectionData[1]
  //     for (let i = 0; i < addArr.length; i++) {
  //       let index = 0
  //       for (let j in this.state.sectionData[1].data) {
  //         if (addArr[i].item.name === this.state.sectionData[1].data[j].name) {
  //           index = parseInt(j)
  //           break
  //         }
  //       }
  //       _section2.data.splice(index, 1)
  //       let item = Object.assign({}, addArr[i].item)
  //       delete item.checked
  //       _section1.data.push(item)
  //     }
  //     this.setApplets(_sectionData)
  //     let result = true
  //     this._getSectionData()
  //     Toast.show(
  //       result
  //         ? getLanguage(global.language).Prompt.ADD_SUCCESS
  //         : getLanguage(global.language).Prompt.ADD_FAILED,
  //     )
  //   } catch (e) {
  //     Toast.show(getLanguage(global.language).Prompt.ADD_FAILED)
  //   }
  // }

  /**
   * 批量删除
   * @param forceDelete
   * @returns {Promise.<void>}
   */
  // batchDelete = async (forceDelete = false) => {
  //   try {
  //     let deleteArr = this._getSelectedList()
  //     if (!forceDelete) {
  //       let relatedMaps = []
  //       relatedMaps = await this.getRelatedMaps(deleteArr)
  //       if (relatedMaps.length !== 0) {
  //         this.showRelatedMapsDialog({
  //           confirmAction: () => this._batchDelete(true),
  //           relatedMaps: relatedMaps,
  //         })
  //         return
  //       } else {
  //         this.showBatchDeleteConfirmDialog({
  //           confirmAction: () => this._batchDelete(true),
  //         })
  //         return
  //       }
  //     }
  //     this.setLoading(true, getLanguage(global.language).Prompt.DELETING_DATA)
  //     let _sectionData = JSON.parse(JSON.stringify(this.state.sectionData))
  //     let _section1 = _sectionData[0]
  //     let _section2 = _sectionData[1]
  //     for (let i = 0; i < deleteArr.length; i++) {
  //       let index = 0
  //       for (let j in this.state.sectionData[0].data) {
  //         if (
  //           deleteArr[i].item.name === this.state.sectionData[0].data[j].name
  //         ) {
  //           index = parseInt(j)
  //           break
  //         }
  //       }
  //       _section1.data.splice(index, 1)
  //       let item = Object.assign({}, deleteArr[i].item)
  //       delete item.checked
  //       _section2.data.push(item)
  //     }
  //     this.setApplets(_sectionData)
  //     let result = true
  //     this._getSectionData()
  //     Toast.show(
  //       result
  //         ? getLanguage(global.language).Prompt.DELETED_SUCCESS
  //         : getLanguage(global.language).Prompt.FAILED_TO_DELETE,
  //     )
  //   } catch (error) {
  //     Toast.show(getLanguage(global.language).Prompt.FAILED_TO_DELETE)
  //   } finally {
  //     this.setLoading(false)
  //   }
  // }

  getCommonPagePopupData = () => [
    {
      title: getLanguage(global.language).Profile.BATCH_ADD,
      action: () => {
        this.setState({
          batchMode: 1,
        })
      },
    },
    {
      title: getLanguage(global.language).Profile.BATCH_DELETE,
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

  // renderBatchBottom = () => {
  //   let title, action, img
  //   switch (this.state.batchMode) {
  //     case 1:
  //       title = getLanguage(global.language).Profile.BATCH_ADD
  //       action = this.batchAdd
  //       img = getPublicAssets().common.icon_plus
  //       break
  //     case 2:
  //       title = getLanguage(global.language).Profile.BATCH_DELETE
  //       action = this.batchDelete
  //       img = getThemeAssets().attribute.icon_delete
  //       break
  //     default:
  //       title = ''
  //       action = () => {}
  //   }
  //   return (
  //     <View style={styles.bottomStyle}>
  //       <TouchableOpacity
  //         style={styles.bottomItemStyle}
  //         onPress={() => action()}
  //       >
  //         {img && (
  //           <Image
  //             style={{
  //               height: scaleSize(50),
  //               width: scaleSize(50),
  //               marginRight: scaleSize(20),
  //             }}
  //             source={img}
  //           />
  //         )}
  //         <Text style={{ fontSize: scaleSize(20) }}>{title}</Text>
  //       </TouchableOpacity>
  //     </View>
  //   )
  // }
}

export default MyApplet

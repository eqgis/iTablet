import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native'
import { MyDataPage } from '../component'
import { getLanguage } from '../../../../language'
import { getThemeAssets, getPublicAssets } from '../../../../assets'
import { scaleSize, Toast } from '../../../../utils'
import { ConfigUtils } from 'imobile_for_reactnative'
import _mapModules, { mapModules } from '../../../../../configs/mapModules'
import styles from './styles'

class MyApplet extends MyDataPage {
  props: {
    setMapModule: () => {},
  }
  constructor(props) {
    super(props)
    this.type = this.types.applet
    this.state = {
      ...this.state,
      showSectionHeader: true,
      batchMode: false, // 1是批量添加，2是批量删除
    }
  }

  getData = async () => {
    let _applets = await ConfigUtils.getApplets(this.props.user.currentUser.userName) || []
    let applets = []
    let othersApplets = []

    // applets为有序数组
    for (let i = 0; i < _applets.length; i++) {
      // 检测本地记录中的小程序是否在当前版本中存在
      if (_mapModules.indexOf(_applets[i]) >= 0) {
        applets.push({
          name: _applets[i],
          img: getThemeAssets().find.app,
        })
      }
    }
    for (let i = 0; i < _mapModules.length; i++) {
      if (_applets.indexOf(_mapModules[i]) < 0) {
        othersApplets.push({
          name: _mapModules[i],
          img: getThemeAssets().find.app,
        })
      }
    }
    let sectionData = []
    sectionData.push({
      title: getLanguage(this.props.language).Find.APPLET,
      data: applets || [],
      isShowItem: true,
    })
    sectionData.push({
      title: getLanguage(global.language).Profile.AVAILABLE_APPLET,
      data: othersApplets || [],
      isShowItem: true,
    })
    return sectionData
  }

  setApplets = sectionData => {
    this.setState({
      sectionData: sectionData,
    })
    let applets = []  // redux使用的对象数组
    let _applets = [] // 本地文件的字符串数组
    sectionData[0].data.map(item => {
      for (let i = 0; i < mapModules.length; i++) {
        if (item.name === mapModules[i].key) {
          applets.push(mapModules[i])
          _applets.push(mapModules[i].key)
        }
      }
    })
    this.props.setMapModule(applets)
    ConfigUtils.recordApplets(this.props.user.currentUser.userName, _applets)
  }

  getItemPopupData = () => {
    if (!this.itemInfo) return []
    let index = this.itemInfo.index
    let item = this.itemInfo.item
    let _sectionData = JSON.parse(JSON.stringify(this.state.sectionData))
    let _section1 = _sectionData[0]
    let _section2 = _sectionData[1]
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
          action: () => {
            this._closeModal()
            _section1.data.push(item)
            _section2.data.splice(index, 1)
            this.setApplets(_sectionData)
          },
        },
      ]
    } else {
      return [
        {
          title: getLanguage(global.language).Profile.MOVE_UP,
          action: () => {
            this._closeModal()
            if (this.itemInfo.index !== 0) {
              _section1.data[index] = _section1.data.splice(index - 1, 1, _section1.data[index])[0]
              this.setApplets(_sectionData)
            }
          },
        },
        {
          title: getLanguage(global.language).Profile.MOVE_DOWN,
          action: () => {
            this._closeModal()
            if (index < _section1.data.length - 1) {
              _section1.data[index] = _section1.data.splice(index + 1, 1, _section1.data[index])[0]
              this.setApplets(_sectionData)
            }
          },
        },
        {
          title: getLanguage(global.language).Profile.DELETE_APPLET,
          action: () => {
            this._closeModal()
            _section1.data.splice(index, 1)
            _section2.data.push(item)
            this.setApplets(_sectionData)
          },
        },
      ]
    }
  }

  isShowCheck = info => {
    let sectionIndex = -1
    for (let i in this.state.sectionData) {
      if (info.section.title === this.state.sectionData[i].title) {
        sectionIndex = parseInt(i)
        break
      }
    }
    if (this.state.batchMode === 1) {
      return sectionIndex === 1
    } else if (this.state.batchMode === 2) {
      return sectionIndex === 0
    } else {
      return false
    }
  }
  
  selectAll = () => {
    let section = this.state.sectionData.clone()
    let j = 0
    let s = []
    switch (this.state.batchMode) {
      case 1:
        s = section[1]
        break
      case 2:
        s = section[0]
        break
    }
    for (let n = 0; n < s.data.length; n++) {
      s.data[n].checked = true
      j++
    }
    this.setState({ section, selectedNum: j })
  }

  deleteData = async () => {
    try {
      let index = 0
      for (let i in this.state.sectionData[0].data) {
        if (this.itemInfo.item.name === this.state.sectionData[0].data[i].name) {
          index = parseInt(i)
          break
        }
      }
      let _sectionData = JSON.parse(JSON.stringify(this.state.sectionData))
      let _section1 = _sectionData[0]
      let _section2 = _sectionData[1]
      this._closeModal()
      _section1.data.splice(index, 1)
      let item = Object.assign({}, this.itemInfo.item)
      delete item.checked
      _section2.data.push(item)
      this.setApplets(_sectionData)
      return true
    } catch (e) {
      return false
    }
  }

  addData = async () => {
    try {
      let index = 0
      for (let i in this.state.sectionData[1].data) {
        if (this.itemInfo.item.name === this.state.sectionData[1].data[i].name) {
          index = parseInt(i)
          break
        }
      }
      let _sectionData = JSON.parse(JSON.stringify(this.state.sectionData))
      let _section1 = _sectionData[0]
      let _section2 = _sectionData[1]
      this._closeModal()
      _section2.data.splice(index, 1)
      let item = Object.assign({}, this.itemInfo.item)
      delete item.checked
      _section1.data.push(item)
      this.setApplets(_sectionData)
      return true
    } catch (e) {
      return false
    }
  }
  
  /**
   * 批量添加
   * @returns {Promise.<void>}
   */
  batchAdd = async () => {
    try {
      let addArr = this._getSelectedList()
      let _sectionData = JSON.parse(JSON.stringify(this.state.sectionData))
      let _section1 = _sectionData[0]
      let _section2 = _sectionData[1]
      for (let i = 0; i < addArr.length; i++) {
        let index = 0
        for (let j in this.state.sectionData[1].data) {
          if (addArr[i].item.name === this.state.sectionData[1].data[j].name) {
            index = parseInt(j)
            break
          }
        }
        _section2.data.splice(index, 1)
        let item = Object.assign({}, addArr[i].item)
        delete item.checked
        _section1.data.push(item)
      }
      this.setApplets(_sectionData)
      let result = true
      this._getSectionData()
      Toast.show(
        result
          ? getLanguage(global.language).Prompt.ADD_SUCCESS
          : getLanguage(global.language).Prompt.ADD_FAILED,
      )
    } catch (e) {
      Toast.show(getLanguage(global.language).Prompt.ADD_FAILED)
    }
  }
  
  /**
   * 批量删除
   * @param forceDelete
   * @returns {Promise.<void>}
   */
  batchDelete = async (forceDelete = false) => {
    try {
      let deleteArr = this._getSelectedList()
      if (!forceDelete) {
        let relatedMaps = []
        relatedMaps = await this.getRelatedMaps(deleteArr)
        if (relatedMaps.length !== 0) {
          this.showRelatedMapsDialog({
            confirmAction: () => this._batchDelete(true),
            relatedMaps: relatedMaps,
          })
          return
        } else {
          this.showBatchDeleteConfirmDialog({
            confirmAction: () => this._batchDelete(true),
          })
          return
        }
      }
      this.setLoading(true, getLanguage(global.language).Prompt.DELETING_DATA)
      let _sectionData = JSON.parse(JSON.stringify(this.state.sectionData))
      let _section1 = _sectionData[0]
      let _section2 = _sectionData[1]
      for (let i = 0; i < deleteArr.length; i++) {
        let index = 0
        for (let j in this.state.sectionData[0].data) {
          if (deleteArr[i].item.name === this.state.sectionData[0].data[j].name) {
            index = parseInt(j)
            break
          }
        }
        _section1.data.splice(index, 1)
        let item = Object.assign({}, deleteArr[i].item)
        delete item.checked
        _section2.data.push(item)
      }
      this.setApplets(_sectionData)
      let result = true
      this._getSectionData()
      Toast.show(
        result
          ? getLanguage(global.language).Prompt.DELETED_SUCCESS
          : getLanguage(global.language).Prompt.FAILED_TO_DELETE,
      )
    } catch (error) {
      Toast.show(getLanguage(global.language).Prompt.FAILED_TO_DELETE)
    } finally {
      this.setLoading(false)
    }
  }

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

  renderBatchBottom = () => {
    let title, action, img
    switch (this.state.batchMode) {
      case 1:
        title = getLanguage(global.language).Profile.BATCH_ADD
        action = this.batchAdd
        img = getPublicAssets().common.icon_plus
        break
      case 2:
        title = getLanguage(global.language).Profile.BATCH_DELETE
        action = this.batchDelete
        img = getThemeAssets().attribute.icon_delete
        break
      default:
        title = ''
        action = () => {}
    }
    return (
      <View style={styles.bottomStyle}>
        <TouchableOpacity
          style={styles.bottomItemStyle}
          onPress={() => action()}
        >
          {
            img && <Image
              style={{
                height: scaleSize(50),
                width: scaleSize(50),
                marginRight: scaleSize(20),
              }}
              source={img}
            />
          }
          <Text style={{ fontSize: scaleSize(20) }}>
            {title}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export default MyApplet

/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { View } from 'react-native'
import NavigationService from '../../../NavigationService'
import {
  Container,
  MTBtn,
  PopModal,
  InfoView,
  Dialog,
} from '../../../../components'
import {
  Toast,
  scaleSize,
  LayerUtils,
  StyleUtils,
  screen,
  dataUtil,
} from '../../../../utils'
import { ConstInfo, ConstToolType, ChunkType } from '../../../../constants'
import { MapToolbar } from '../../../workspace/components'
import {
  LayerAttributeTable,
  LayerTopBar,
  LocationView,
} from '../../components'
import { getThemeAssets } from '../../../../assets'
import { FileTools } from '../../../../native'
import styles from './styles'
import {
  SMap,
  Action,
  GeoStyle,
  SMediaCollector,
  FieldType,
  DatasetType,
  TextStyle,
  GeometryType,
} from 'imobile_for_reactnative'
import { getLanguage } from '../../../../language'
import { color } from '../../../../styles'
//eslint-disable-next-line
// import { ActionPopover } from 'teaset'
import ToolbarModule from '../../../workspace/components/ToolBar/modules/ToolbarModule'
import LayerAttributeAdd from '../layerAttributeAdd'

const SINGLE_ATTRIBUTE = 'singleAttribute'
const PAGE_SIZE = 30
const ROWS_LIMIT = 120
const COL_HEIGHT = scaleSize(80)

let deleteFieldData //删除属性字段

export default class LayerAttribute extends React.Component {
  props: {
    language: string,
    nav: Object,
    navigation: Object,
    currentAttribute: Object,
    currentLayer: Object,
    selection: Object,
    map: Object,
    appConfig: Object,
    mapModules: Object,
    attributesHistory: Array,
    attributes: Object, // 此时用于3D属性
    // setAttributes: () => {},
    setCurrentAttribute: () => {},
    // getAttributes: () => {},
    setLayerAttributes: () => {},
    setAttributeHistory: () => {},
    clearAttributeHistory: () => {},
    getLayers: () => {},
    device: Object,
    currentTask: Object,
    currentUser: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.route
    this.type = (params && params.type) || global.Type
    let checkData = this.checkToolIsViable()
    this.state = {
      attributes: {
        head: [],
        data: [],
      },
      showTable: false,
      editControllerVisible: false,
      addControllerVisible: false,
      currentFieldInfo: [],
      relativeIndex: -1, // 当前页面从startIndex开始的被选中的index, 0 -> this.total - 1
      currentIndex: -1,
      startIndex: 0,

      canBeUndo: checkData.canBeUndo,
      canBeRedo: checkData.canBeRedo,
      canBeRevert: checkData.canBeRevert,

      isShowSystemFields: true,
      descending:false, //属性排列倒序时为true add jiakai
    }

    this.currentPage = 0
    this.total = 0 // 属性总数
    this.canBeRefresh = true // 是否可以刷新
    this.noMore = false // 是否可以加载更多
    this.isLoading = false // 防止同时重复加载多次
    this.filter = '' // 属性查询过滤
    this.isMediaLayer = false // 是否是多媒体图层
  }

  componentDidMount() {
    // InteractionManager.runAfterInteractions(() => {
    if (this.type === 'MAP_3D') {
      this.getMap3DAttribute()
    } else if (this.props.currentLayer?.name) {
      this.setLoading(true, getLanguage(this.props.language).Prompt.LOADING)
      //ConstInfo.LOADING_DATA)
      SMediaCollector.isMediaLayer(this.props.currentLayer.name).then(result => {
        this.isMediaLayer = result
        this.refresh()
      }).catch(() =>{
        this.refresh()
      })
    }
    // })
  }

  shouldComponentUpdate(nextProps, nextState) {
    let shouldUpdate = (
      JSON.stringify(nextProps) !== JSON.stringify(this.props) ||
      JSON.stringify(nextState) !== JSON.stringify(this.state)
    )
    return shouldUpdate
  }

  componentDidUpdate(prevProps) {
    if (
      this.type === 'MAP_3D' &&
      this.state.attributes !== prevProps.attributes
    ) {
      this.setState({
        attributes: prevProps.attributes,
      })
      this.total = prevProps.attributes.data.length
      // console.log(prevProps)
    } else if (
      prevProps.currentLayer &&
      JSON.stringify(prevProps.currentLayer) !==
      JSON.stringify(this.props.currentLayer)
    ) {
      this.filter = ''
      // 切换图层，重置属性界面
      this.currentPage = 0
      this.total = 0 // 属性总数
      this.canBeRefresh = false
      this.noMore = false
      this.props.currentLayer?.name && SMediaCollector.isMediaLayer(this.props.currentLayer.name).then(result => {
        this.isMediaLayer = result
      })
      this.refresh(null, true)
    } else if (
      JSON.stringify(prevProps.attributesHistory) !==
      JSON.stringify(this.props.attributesHistory)
    ) {
      let checkData = this.checkToolIsViable()
      this.setState({
        ...checkData,
      })
    } else if (global.NEEDREFRESHTABLE) {
      global.NEEDREFRESHTABLE = false
      let startIndex = this.state.startIndex - PAGE_SIZE
      if (startIndex <= 0) {
        startIndex = 0
        this.canBeRefresh = false
      }
      let currentPage = startIndex / PAGE_SIZE
      // this.noMore = false
      this.getAttribute({
        type: 'reset',
        currentPage: currentPage,
        startIndex: startIndex <= 0 ? 0 : startIndex,
      })
    }
  }

  componentWillUnmount() {
    this.props.setCurrentAttribute({})
  }

  getMap3DAttribute = async (cb = () => { }) => {
    if (!this.state.showTable) {
      this.setState({
        showTable: true,
        attributes: this.props.attributes,
      })
      this.total = this.props.attributes.data.length
    }
    cb && cb()
  }

  /** 下拉刷新 **/
  refresh = (cb = () => { }, resetCurrent = false) => {
    if (!this.canBeRefresh || !!this.props.currentLayer.name) {
      //Toast.show('已经是最新的了')
      this.getAttribute(
        {
          type: 'reset',
          currentPage: 0,
          startIndex: 0,
        },
        cb,
        resetCurrent,
      )
      this.currentPage = 0
      return
    }
    let startIndex = this.state.startIndex - PAGE_SIZE
    if (startIndex <= 0) {
      startIndex = 0
      this.canBeRefresh = false
    }
    let currentPage = startIndex / PAGE_SIZE
    // this.noMore = false
    this.getAttribute(
      {
        type: 'refresh',
        currentPage: currentPage,
        startIndex: startIndex <= 0 ? 0 : startIndex,
      },
      cb,
      resetCurrent,
    )
  }

  /** 加载更多 **/
  loadMore = (cb = () => { }) => {
    if (this.isLoading || !this.props.currentLayer.name) return
    if (this.noMore) {
      cb && cb()
      return
    }
    this.isLoading = true
    this.currentPage += 1
    this.getAttribute(
      {
        type: 'loadMore',
        currentPage: this.currentPage,
      },
      attributes => {
        cb && cb()
        this.isLoading = false
        this.canBeRefresh = this.state.startIndex > 0
        if (!attributes || !attributes.data || attributes.data.length <= 0) {
          this.noMore = true
          Toast.show(ConstInfo.ALL_DATA_ALREADY_LOADED)
          // this.currentPage--
        }
      },
    )
  }

  /**
   * 获取属性
   * @param params 参数
   * @param cb 回调函数
   * @param resetCurrent 是否重置当前选择的对象
   */
  getAttribute = (params = {}, cb = () => { }, resetCurrent = false) => {
    if (!this.props.currentLayer.path || params.currentPage < 0) {
      this.setLoading(false)
      return
    }
    let { currentPage, pageSize, type, ...others } = params
    let result = {},
      attributes = {}
    ; (async function () {
      try {
        let checkData = this.checkToolIsViable()
        result = await LayerUtils.getLayerAttribute(
          JSON.parse(JSON.stringify(this.state.attributes)),
          this.props.currentLayer.path,
          currentPage,
          pageSize !== undefined ? pageSize : PAGE_SIZE,
          {
            filter: this.filter,
          },
          type,
        )

        this.total = result.total || 0
        attributes = result.attributes || []

        // this.noMore =
        //   Math.floor(this.total / PAGE_SIZE) === currentPage ||
        //   attributes.data.length < PAGE_SIZE

        if (this.total === 1 && attributes.data.length === 1) {
          this.setState({
            showTable: true,
            attributes,
            currentIndex: 0,
            relativeIndex: 0,
            currentFieldInfo: attributes.data[0],
            startIndex: 0,
            ...checkData,
            ...others,
          })
          this.setLoading(false)
          cb && cb(attributes)
        } else {
          let newAttributes = JSON.parse(JSON.stringify(attributes))
          let startIndex =
            others.startIndex >= 0
              ? others.startIndex
              : this.state.startIndex || 0
          // 截取数据，最多显示 ROWS_LIMIT 行
          if (attributes.data.length > ROWS_LIMIT) {
            if (type === 'refresh') {
              newAttributes.data = newAttributes.data.slice(0, ROWS_LIMIT)
              startIndex = result.startIndex
            } else {
              startIndex = result.startIndex + result.resLength - ROWS_LIMIT
              startIndex =
                parseInt((startIndex / PAGE_SIZE).toFixed()) * PAGE_SIZE

              let sliceStartIndex = 0
              if (attributes.data.length >= ROWS_LIMIT) {
                sliceStartIndex =
                  parseInt(
                    (
                      (attributes.data.length - ROWS_LIMIT) /
                      PAGE_SIZE
                    ).toFixed(),
                  ) * PAGE_SIZE
              }
              newAttributes.data = newAttributes.data.slice(
                sliceStartIndex,
                attributes.data.length,
              )
            }
          }

          let currentIndex = resetCurrent
            ? -1
            : others.currentIndex !== undefined
              ? others.currentIndex
              : this.state.currentIndex
          let relativeIndex =
            resetCurrent || currentIndex < 0 ? -1 : currentIndex - startIndex
          // : currentIndex - startIndex - 1
          let prevStartIndex = this.state.startIndex
          this.currentPage = Math.floor(
            (startIndex + newAttributes.data.length - 1) / PAGE_SIZE,
          )
          this.noMore = startIndex + newAttributes.data.length === this.total
          this.setState(
            {
              showTable: true,
              attributes: newAttributes,
              currentIndex,
              relativeIndex,
              currentFieldInfo:
                relativeIndex >= 0 && relativeIndex < newAttributes.data.length
                  ? newAttributes.data[relativeIndex]
                  : this.state.currentFieldInfo,
              startIndex,
              ...checkData,
              // ...others,
            },
            () => {
              setTimeout(() => {
                if (type === 'refresh') {
                  this.table &&
                    this.table.scrollToLocation({
                      animated: false,
                      itemIndex: prevStartIndex - startIndex,
                      sectionIndex: 0,
                      viewPosition: 0,
                      viewOffset: COL_HEIGHT,
                    })
                } else if (type === 'loadMore') {
                  this.table &&
                    this.table.scrollToLocation({
                      animated: false,
                      itemIndex: newAttributes.data.length - result.resLength,
                      sectionIndex: 0,
                      viewPosition: 1,
                    })
                }
                this.setLoading(false)
                cb && cb(attributes)
              }, 0)
            },
          )
        }
      } catch (e) {
        this.isLoading = false
        this.setLoading(false)
        cb && cb(attributes)
      }
    }.bind(this)())
  }

  /**
   * 定位到首位
   */
  locateToTop = () => {
    this.setLoading(true, getLanguage(global.language).Prompt.LOCATING)
    //ConstInfo.LOCATING)
    this.currentPage = 0
    if (this.state.startIndex === 0) {
      this.setState(
        {
          relativeIndex: 0,
          currentIndex: 0,
        },
        () => {
          let item = this.table.setSelected(0, false)
          this.locationView && this.locationView.show(false)
          this.setState({
            currentFieldInfo: item.data,
          })
          this.table &&
            this.table.scrollToLocation({
              animated: false,
              itemIndex: 0,
              sectionIndex: 0,
              viewPosition: 0,
            })
          this.setLoading(false)
        },
      )
    } else {
      this.getAttribute(
        {
          type: 'reset',
          currentPage: this.currentPage,
          startIndex: 0,
          relativeIndex: 0,
          currentIndex: 0,
        },
        () => {
          // 等表格中的数据变化
          setTimeout(() => {
            let item = this.table.setSelected(0, false)
            this.setState({
              currentFieldInfo: item.data,
            })
            this.locationView && this.locationView.show(false)
            this.canBeRefresh = false
            this.table &&
              this.table.scrollToLocation({
                animated: false,
                itemIndex: 0,
                sectionIndex: 0,
                viewPosition: 0,
              })
            this.setLoading(false)
          }, 0)
        },
      )
    }
  }

  /**
   * 定位到末尾
   */
  locateToBottom = () => {
    if (this.total <= 0) return
    this.setLoading(true, getLanguage(global.language).Prompt.LOCATING)
    //ConstInfo.LOCATING)
    this.currentPage =
      this.total > 0 ? Math.floor((this.total - 1) / PAGE_SIZE) : 0
    let remainder = this.total > 0 ? (this.total - 1) % PAGE_SIZE : 0

    let startIndex = this.currentPage * PAGE_SIZE
    if (startIndex !== 0) {
      this.canBeRefresh = true
    }
    this.noMore = true
    this.getAttribute(
      {
        type: 'reset',
        currentPage: this.currentPage,
        startIndex: startIndex,
        relativeIndex: remainder,
        currentIndex: this.total - 1,
      },
      () => {
        // 等表格中的数据变化
        setTimeout(() => {
          if (this.table) {
            let item = this.table.setSelected(remainder, false)
            this.setState({
              currentFieldInfo: item.data,
            })
            this.table &&
              this.table.scrollToLocation({
                animated: false,
                itemIndex: remainder,
                sectionIndex: 0,
                viewOffset: 0,
                viewPosition: 1,
              })
          }
          this.setLoading(false)
        }, 100)
      },
    )
    this.locationView && this.locationView.show(false)
  }

  /**
   * 定位到指定位置（相对/绝对 位置）
   * @param data {value, inputValue}
   */
  locateToPosition = (data = {}) => {
    let viewPosition = 0,
      relativeIndex,
      currentIndex,
      startIndex = this.state.startIndex,
      isInViewableData = false
    if (data.type === 'relative') {
      // 相对定位
      currentIndex = this.state.currentIndex + data.index
      if (currentIndex < 0 || currentIndex >= this.total) {
        Toast.show(getLanguage(global.language).Prompt.INDEX_OUT_OF_BOUNDS)
        //'位置越界')
        return
      }
      this.currentPage = Math.floor(currentIndex / PAGE_SIZE)

      if (
        currentIndex >= this.state.startIndex &&
        currentIndex < this.state.startIndex + this.state.attributes.data.length
      ) {
        // 定位在当前显示数据范围内
        relativeIndex = this.state.relativeIndex + data.index
        isInViewableData = true
      } else {
        // 定位在当前显示数据范围外
        startIndex = this.currentPage * PAGE_SIZE
        relativeIndex = currentIndex - startIndex
      }
    } else if (data.type === 'absolute') {
      // 绝对定位
      if (data.index <= 0 || data.index > this.total) {
        Toast.show(getLanguage(global.language).Prompt.INDEX_OUT_OF_BOUNDS)
        //'位置越界')
        return
      }
      this.currentPage = Math.floor((data.index - 1) / PAGE_SIZE)
      if (
        data.index >= this.state.startIndex + 1 &&
        data.index < this.state.startIndex + this.state.attributes.data.length
      ) {
        // 定位在当前显示数据范围内
        relativeIndex = data.index - 1 - this.state.startIndex
        isInViewableData = true
      } else {
        // 定位在当前显示数据范围外
        startIndex = this.currentPage * PAGE_SIZE
        relativeIndex = data.index - 1 - startIndex
      }
      currentIndex = data.index - 1
    }

    this.setLoading(true, getLanguage(global.language).Prompt.LOCATING)
    //ConstInfo.LOCATING)
    if (startIndex !== 0) {
      this.canBeRefresh = true
    }

    if (isInViewableData) {
      let item = this.table.setSelected(relativeIndex, false)
      this.setState(
        {
          currentFieldInfo: item.data,
          startIndex: startIndex,
          relativeIndex: relativeIndex,
          currentIndex,
        },
        () => {
          this.table &&
            this.table.scrollToLocation({
              animated: false,
              itemIndex: relativeIndex,
              sectionIndex: 0,
              viewPosition: viewPosition,
              viewOffset: viewPosition === 1 ? 0 : undefined, // 滚动显示在底部，不需要设置offset
            })
        },
      )
      this.setLoading(false)
    } else {
      this.getAttribute(
        {
          type: 'reset',
          currentPage: this.currentPage,
          startIndex: startIndex,
          relativeIndex: relativeIndex,
          currentIndex,
        },
        () => {
          if (this.table) {
            setTimeout(() => {
              // 避免 Android 更新数据后无法滚动
              let item = this.table.setSelected(relativeIndex, false)
              this.setState(
                {
                  currentFieldInfo: item.data,
                },
                () => {
                  this.table &&
                    this.table.scrollToLocation({
                      animated: false,
                      itemIndex: relativeIndex,
                      sectionIndex: 0,
                      viewPosition: viewPosition,
                      viewOffset: viewPosition === 1 ? 0 : undefined, // 滚动显示在底部，不需要设置offset
                    })
                },
              )
            }, 0)
          }
          this.setLoading(false)
        },
      )
    }
  }

  selectRow = ({ data, index }) => {
    if (!data || index < 0 || this.total === 1 && this.state.attributes.data.length === 1) return

    if (this.state.relativeIndex !== index) {
      this.setState({
        currentFieldInfo: data,
        relativeIndex: index,
        currentIndex: this.state.startIndex + index,
      })
    } else {
      this.setState({
        currentFieldInfo: [],
        relativeIndex: -1,
        currentIndex: -1,
      })
    }

    // global.SelectedSelectionAttribute = {
    //   index:this.state.startIndex + index,
    //   layerInfo:this.props.layerSelection.layerInfo,
    //   data,
    // }
  }

  //显示详情和删除的弹框
  _showPopover = (pressView, index, fieldInfo) => {
    let items = []

    items = [
      {
        title: getLanguage(global.language).Map_Attribute.DETAIL,
        onPress: () => {
          (async function () {
            this.addPopModal &&
              this.addPopModal.setVisible(true, {
                data: { fieldInfo },
                isDetail: true,
              })
          }.bind(this)())
        },
      },
    ]
    if (this.state.attributes.data.length > 1) {
      items.push({
        title: getLanguage(global.language).Map_Attribute.ASCENDING,
        onPress: () => {
          this.canBeRefresh = true
          this.filter = fieldInfo.name + ' ASC'
          this.getAttribute({
            type: 'reset',
            currentPage: 0,
            startIndex: 0,
          })
          this.setState({descending:false})
        },
      })
      items.push({
        title: getLanguage(global.language).Map_Attribute.DESCENDING,
        onPress: () => {
          this.canBeRefresh = true
          this.filter = fieldInfo.name + ' DESC'
          this.getAttribute({
            type: 'reset',
            currentPage: 0,
            startIndex: 0,
          })
          this.setState({descending:true})
        },
      })
    }
    let tempStr = fieldInfo.caption.toLowerCase()
    let isSystemField = tempStr.substring(0, 2) === 'sm'
    // 系统字段或者多媒体路径字段不能删除
    if (
      !fieldInfo.isSystemField &&
      !isSystemField && (
        !this.isMediaLayer ||
        this.isMediaLayer &&
        fieldInfo.name !== 'MediaFilePaths' &&
        fieldInfo.name !== 'MediaServiceIds' &&
        fieldInfo.name !== 'MediaName' &&
        fieldInfo.name !== 'ModifiedDate' &&
        fieldInfo.name !== 'Description' &&
        fieldInfo.name !== 'HttpAddress'
      )
    ) {
      items.push({
        title: getLanguage(global.language).Profile.DELETE,
        onPress: () => {
          if (!fieldInfo) {
            return
          }
          deleteFieldData = fieldInfo
          this.deleteFieldDialog.setDialogVisible(true)
        },
      })
    }
    if (
      this.state.attributes.data.length > 1 &&
      (fieldInfo.type === FieldType.INT16 ||
        fieldInfo.type === FieldType.INT32 ||
        fieldInfo.type === FieldType.INT64 ||
        fieldInfo.type === FieldType.SINGLE ||
        fieldInfo.type === FieldType.DOUBLE)
    ) {
      items.push({
        title: getLanguage(global.language).Map_Attribute.ATTRIBUTE_STATISTIC,
        onPress: () => {
          NavigationService.navigate('LayerAttributeStatistic', {
            fieldInfo,
            layer: this.props.currentLayer,
          })
        },
      })
    }
    if (pressView) {
      pressView.measure((ox, oy, width, height, px, py) => {
        let screenWidth = screen.getScreenWidth(),
          allWidth = width * items.length
        // let dx = screenWidth - allWidth / 2 + width / 2
        // let x = px > dx ? dx : px
        let option = {}
        if (px > screenWidth - allWidth / 2 + width / 2) {
          option.direction = 'left'
        }
        // ActionPopover.show(
        //   {
        //     x: px,
        //     y: py,
        //     width,
        //     height,
        //   },
        //   items,
        //   option,
        // )
      })
    }
  }
  /** 点击属性字段回调 **/
  onPressHeader = ({ fieldInfo, index, pressView }) => {
    if (global.Type === ChunkType.MAP_3D) {
      return
    }
    this._showPopover(pressView, index, fieldInfo)
  }

  showLayerAddView = () => {
    // global.ToolBar.showFullMap(true)
    this.addPopModal && this.addPopModal.setVisible(true)
  }

  /** 删除事件 **/
  deleteAction = async () => {
    let index = this.state.currentIndex
    if (this.state.currentIndex > this.state.attributes.data.length) {
      index = this.state.attributes.data.length - (this.total - this.state.currentIndex)
    }
    let smID = -1, // 用于找到删除的对象
      hasMedia = false // 是否包含多媒体图片
    for (let i = 0; i < this.state.attributes.data[index].length; i++) {
      if (this.state.attributes.data[index][i].name === 'SmID') {
        smID = this.state.attributes.data[index][i].value
        if (smID >= 0 && hasMedia) break
      } else if (
        this.state.attributes.data[index][i].name === 'MediaFilePaths' &&
        this.state.attributes.data[index][i].value != ''
      ) {
        hasMedia = true
        if (smID >= 0 && hasMedia) break
      }
    }
    let result
    // 若包含多媒体图片，则删除
    if (hasMedia && smID >= 0) {
      result = await SMediaCollector.deleteMedia(this.props.currentLayer.path, smID)
    } else {
      //此处计算数据倒序时后实际上的数据index add jiakai
      let index
      if(this.state.descending){
        index = this.total - this.state.currentIndex -1
      }else{
        index = this.state.currentIndex
      }
      result = await LayerUtils.deleteAttributeByLayer(this.props.currentLayer.name, index, false)
    }
    if (result) {
      if (global.coworkMode) {
        SMap.setLayerModified(this.props.currentLayer.path, true) // 在线协作-成功删除数据,修改图层状态
        this.props.getLayers?.()
      }
      Toast.show(getLanguage(this.props.language).Prompt.DELETED_SUCCESS)
    } else {
      Toast.show(getLanguage(this.props.language).Prompt.FAILED_TO_DELETE)
    }
    this.refresh()
    this.setState({
      currentFieldInfo: [],
      relativeIndex: -1,
      currentIndex: -1,
    })
  }

  /** 拍照后刷新事件 **/
  refreshAction = async () => {
    try {
      if (this.props.currentLayer?.name) {
        this.isMediaLayer = await SMediaCollector.isMediaLayer(this.props.currentLayer.name)
        this.refresh()
      } else {
        this.refresh()
      }
    } catch (error) {
      this.refresh()
    }
  }

  /** 添加属性字段 **/
  addAttributeField = async fieldInfo => {
    let path = this.props.currentLayer.path
    let checkName = dataUtil.isLegalName(fieldInfo.name, this.props.language)
    if (!checkName.result) {
      Toast.show(getLanguage(this.props.language).Map_Attribute.NAME + checkName.error)
      return false
    }
    let checkCaption = dataUtil.isLegalName(fieldInfo.caption, this.props.language)
    if (!checkCaption.result) {
      Toast.show(getLanguage(this.props.language).Map_Attribute.ALIAS + checkCaption.error)
      return false
    }
    let result = await SMap.addAttributeFieldInfo(path, false, fieldInfo)
    if (result) {
      Toast.show(getLanguage(this.props.language).Prompt.ATTRIBUTE_ADD_SUCCESS)
      this.refresh()
    } else {
      Toast.show(getLanguage(this.props.language).Prompt.ATTRIBUTE_ADD_FAILED)
    }
    return result
  }

  /** 关联事件 **/
  relateAction = () => {
    if (this.state.currentFieldInfo.length === 0) return
    SMap.setAction(Action.PAN)
    SMap.setLayerEditable(this.props.currentLayer.path, false)
    let geoStyle = new GeoStyle()
    geoStyle.setFillForeColor(0, 255, 0, 0.5)
    geoStyle.setLineWidth(1)
    geoStyle.setLineColor(70, 128, 223)
    geoStyle.setMarkerHeight(5)
    geoStyle.setMarkerWidth(5)
    geoStyle.setMarkerSize(10)
    // 检查是否是文本对象，若是，则使用TextStyle
    for (let j = 0; j < this.state.currentFieldInfo.length; j++) {
      if (
        this.state.currentFieldInfo[j].name === 'SmGeoType' &&
        this.state.currentFieldInfo[j].value === GeometryType.GEOTEXT
      ) {
        geoStyle = new TextStyle()
        geoStyle.setForeColor(0, 255, 0, 0.5)
        break
      }
    }
    SMap.setTrackingLayer(
      [
        {
          layerPath: this.props.currentLayer.path,
          ids: [
            this.state.currentFieldInfo[0].name === 'SmID'
              ? this.state.currentFieldInfo[0].value
              : this.state.currentFieldInfo[1].value,
          ],
          style: JSON.stringify(geoStyle),
        },
      ],
      true,
    ).then(data => {
      ToolbarModule.setToolBarData(
        ConstToolType.SM_MAP_TOOL_ATTRIBUTE_RELATE,
      ).then(() => {
        this.props.navigation &&
          this.props.navigation.navigate('MapView', {
            hideMapController: true,
          })
        global.toolBox &&
          global.toolBox.setVisible(
            true,
            ConstToolType.SM_MAP_TOOL_ATTRIBUTE_RELATE,
            {
              isFullScreen: false,
              // height: 0,
            },
          )
      })

      global.toolBox && global.toolBox.showFullMap()
      if ((global.Type === ChunkType.MAP_AR || global.Type === ChunkType.MAP_AR_ANALYSIS) && global.showAIDetect) {
        global.toolBox && global.toolBox.switchAr()
      }

      StyleUtils.setSelectionStyle(this.props.currentLayer.path)
      if (data instanceof Array && data.length > 0) {
        SMap.moveToPoint({
          x: data[0].x,
          y: data[0].y,
        })
      }
    })
    // SMap.selectObj(this.props.currentLayer.path, [
    //   this.state.currentFieldInfo[0].value,
    // ]).then(data => {
    //   this.props.navigation && this.props.navigation.navigate('MapView')
    //   global.toolBox &&
    //     global.toolBox.setVisible(true, ConstToolType.SM_MAP_TOOL_ATTRIBUTE_RELATE, {
    //       isFullScreen: false,
    //       height: 0,
    //     })
    //   global.toolBox && global.toolBox.showFullMap()
    //
    //   StyleUtils.setSelectionStyle(this.props.currentLayer.path)
    //   if (data instanceof Array && data.length > 0) {
    //     SMap.moveToPoint({
    //       x: data[0].x,
    //       y: data[0].y,
    //     })
    //   }
    // })
  }

  setLoading = (loading = false, info, extra) => {
    this.container && this.container.setLoading(loading, info, extra)
  }

  setSaveViewVisible = visible => {
    global.SaveMapView &&
      global.SaveMapView.setVisible(visible, {
        setLoading: this.setLoading,
      })
  }

  /** 修改表格中的值的回调 **/
  changeAction = data => {
    if (
      this.props.setLayerAttributes &&
      typeof this.props.setLayerAttributes === 'function'
    ) {
      // 单个对象属性和多个对象属性数据有区别，单个属性cellData是值
      let isSingleData = this.total === 1 && this.state.attributes.data.length === 1
      // 单个对象属性 在 隐藏系统字段下，要重新计算index
      if (isSingleData && !this.state.isShowSystemFields) {
        for (let index in this.state.attributes.data[0]) {
          if (this.state.attributes.data[0][index].name === data.rowData.name) {
            data.index = index
          }
        }
      }
      this.props
        .setLayerAttributes([
          {
            mapName: this.props.map.currentMap.name,
            layerPath: this.props.currentLayer.path,
            fieldInfo: [
              {
                name: isSingleData ? data.rowData.name : data.cellData.name,
                value: data.value,
                index: data.index,
                columnIndex: data.columnIndex,
                smID: isSingleData
                  ? this.state.attributes.data[0][0].value
                  : data.rowData[1].value,
              },
            ],
            prevData: [
              {
                name: isSingleData ? data.rowData.name : data.cellData.name,
                value: isSingleData ? data.rowData.value : data.cellData.value,
                index: data.index,
                columnIndex: data.columnIndex,
                smID: isSingleData
                  ? this.state.attributes.data[0][0].value
                  : data.rowData[1].value,
              },
            ],
            params: {
              // index: int,      // 当前对象所在记录集中的位置
              filter: `SmID=${isSingleData
                ? this.state.attributes.data[0][0].value
                : data.rowData[1].value // 0为序号
              }`, // 过滤条件
              cursorType: 2, // 2: DYNAMIC, 3: STATIC
            },
          },
        ])
        .then(result => {
          // if (!isSingleData && result) {
          if (result) {
            // 成功修改属性后，更新数据
            let attributes = JSON.parse(JSON.stringify(this.state.attributes))
            // 如果有序号，column.index要 -1
            // let column = this.state.attributes.data.length > 1 ? (data.columnIndex - 1) : data.columnIndex
            if (this.state.attributes.data.length > 1) {
              attributes.data[data.index][data.columnIndex - 1].value =
                data.value
            } else {
              // 单条数据修改属性
              attributes.data[0][data.index].value = data.value
            }
            this.props.getLayers?.()
            let checkData = this.checkToolIsViable()
            this.setState({
              attributes,
              ...checkData,
            })
          } else {
            Toast.show(
              getLanguage(this.props.language).Prompt.INVALID_DATA_SET_FAILED,
            )
          }
        })
    }
  }

  /** 检测撤销/恢复/还原是否可用 **/
  checkToolIsViable = () => {
    let historyObj
    for (let i = 0; i < this.props.attributesHistory.length; i++) {
      if (
        this.props.attributesHistory[i].mapName ===
        this.props.map.currentMap.name
      ) {
        let layerHistory = this.props.attributesHistory[i].layers
        for (let j = 0; j < layerHistory.length; j++) {
          if (layerHistory[j].layerPath === this.props.currentLayer.path) {
            historyObj = layerHistory[j]
            break
          }
        }
        break
      }
    }

    return {
      canBeUndo: LayerUtils.canBeUndo(historyObj),
      canBeRedo: LayerUtils.canBeRedo(historyObj),
      canBeRevert: LayerUtils.canBeRevert(historyObj),
    }
  }

  setAttributeHistory = async type => {
    if (!type) return
    switch (type) {
      case 'undo':
        if (!this.state.canBeUndo) {
          // Toast.show('已经无法回撤')
          // this.setLoading(false)
          return
        }
        break
      case 'redo':
        if (!this.state.canBeRedo) {
          // Toast.show('已经无法恢复')
          // this.setLoading(false)
          return
        }
        break
      case 'revert':
        if (!this.state.canBeRevert) {
          // Toast.show('已经无法还原')
          // this.setLoading(false)
          return
        }
        break
    }
    this.setLoading(true, getLanguage(global.language).Prompt.LOADING)
    //'修改中')
    try {
      this.props.setAttributeHistory &&
        (await this.props
          .setAttributeHistory({
            mapName: this.props.map.currentMap.name,
            layerPath: this.props.currentLayer.path,
            type,
          })
          .then(({ msg, result, data }) => {
            if (!msg === '成功') Toast.show(msg)
            if (result) {
              let attributes = JSON.parse(JSON.stringify(this.state.attributes))

              // if (data.length === 1) {
              //   let fieldInfo = data[0].fieldInfo
              //   if (this.state.attributes.data.length > 1) {
              //     if (
              //       attributes.data[fieldInfo[0].index][
              //         fieldInfo[0].columnIndex - 1
              //       ].name === fieldInfo[0].name &&
              //       attributes.data[fieldInfo[0].index][
              //         fieldInfo[0].columnIndex - 1
              //       ].value === fieldInfo[0].value
              //     ) {
              //       this.setAttributeHistory(type)
              //       return
              //     }
              //   } else {
              //     if (
              //       attributes.data[0][fieldInfo[0].index].name ===
              //         fieldInfo[0].name &&
              //       attributes.data[0][fieldInfo[0].index].value ===
              //         fieldInfo[0].value
              //     ) {
              //       this.setAttributeHistory(type)
              //       return
              //     }
              //   }
              // }

              for (let i = 0; i < data.length; i++) {
                let fieldInfo = data[i].fieldInfo
                for (let j = 0; j < fieldInfo.length; j++) {
                  if (this.state.attributes.data.length > 1) {
                    if (
                      attributes.data[0][0].value <= fieldInfo[j].smID &&
                      attributes.data[attributes.data.length - 1][0].value >=
                      fieldInfo[j].smID
                    ) {
                      for (let _data of attributes.data) {
                        if (_data[0].value === fieldInfo[j].smID) {
                          _data[fieldInfo[j].columnIndex - 1].value =
                            fieldInfo[j].value
                          continue
                        }
                      }
                    }
                  } else {
                    if (
                      attributes.data[0][fieldInfo[j].index].name ===
                      fieldInfo[j].name &&
                      attributes.data[0][fieldInfo[j].index].value !==
                      fieldInfo[j].value
                    ) {
                      attributes.data[0][fieldInfo[j].index].value =
                        fieldInfo[j].value
                    }
                  }
                }
              }
              let checkData = this.checkToolIsViable()
              this.setState(
                {
                  attributes,
                  ...checkData,
                },
                () => {
                  setTimeout(() => {
                    this.setLoading(false)
                    if (
                      this.state.attributes.data.length > 1 &&
                      data.length === 1
                    ) {
                      this.locateToPosition({
                        type: 'absolute',
                        index: data[0].fieldInfo[0].index + 1,
                      })
                    }
                  }, 0)
                },
              )
            } else {
              this.setLoading(false)
            }
          }))
    } catch (e) {
      this.setLoading(false)
    }
  }

  showUndoView = () => {
    this.popModal && this.popModal.setVisible(true)
  }

  showLocationView = () => {
    this.locationView && this.locationView.show(true)
  }

  goToSearch = () => {
    NavigationService.navigate('LayerAttributeSearch', {
      layerPath: this.props.currentLayer.path,
      cb: this.refresh,
    })
  }

  showSystemFields = () => {
    this.table && this.table.horizontalScrollToStart()
    this.setState({
      isShowSystemFields: !this.state.isShowSystemFields,
    })
  }

  //提示是否删除属性字段
  renderDeleteFieldDialog = () => {
    return (
      <Dialog
        ref={ref => (this.deleteFieldDialog = ref)}
        type={'modal'}
        confirmAction={async () => {
          this.deleteFieldDialog.setDialogVisible(false)
          let layerPath = this.props.currentLayer.path
          if (this.filter.split(' ').indexOf(deleteFieldData.name) >= 0) {
            this.filter = ''
          }
          let result = await SMap.removeRecordsetFieldInfo(
            layerPath,
            false,
            deleteFieldData.name,
          )
          if (
            this.filter &&
            this.filter.split(' ').indexOf(deleteFieldData.name) >= 0
          ) {
            this.filter = ''
          }
          if (result) {
            Toast.show(
              getLanguage(this.props.language).Prompt.ATTRIBUTE_DELETE_SUCCESS,
            )
            this.props.clearAttributeHistory &&
              this.props.clearAttributeHistory()
            this.canBeRefresh = false
            this.refresh()
          } else {
            Toast.show(
              getLanguage(this.props.language).Prompt.ATTRIBUTE_DELETE_FAILED,
            )
          }
        }}
        confirmBtnTitle={getLanguage(this.props.language).Prompt.CONFIRM}
        cancelBtnTitle={getLanguage(this.props.language).Prompt.CANCEL}
        opacity={1}
        opacityStyle={[styles.opacityView, { height: scaleSize(250) }]}
        cancelAction={() => {
          this.deleteFieldDialog.setDialogVisible(false)
        }}
        title={getLanguage(this.props.language).Prompt.ATTRIBUTE_DELETE_CONFIRM}
        info={getLanguage(this.props.language).Prompt.ATTRIBUTE_DELETE_TIPS}
      />
    )
  }

  renderToolBar = () => {
    return (
      <MapToolbar
        navigation={this.props.navigation}
        mapModules={this.props.mapModules}
        initIndex={2}
        type={this.type}
      />
    )
  }

  renderMapLayerAttribute = () => {
    // let buttonNameFilter = this.isMediaLayer ? ['MediaFilePaths', 'MediaServiceIds', 'MediaData'] : [], // 属性表cell显示 查看 按钮
    //   buttonTitles = this.isMediaLayer ? [getLanguage(global.language).Map_Tools.VIEW, getLanguage(global.language).Map_Tools.VIEW, getLanguage(global.language).Map_Tools.VIEW] : []
    let buttonNameFilter = this.isMediaLayer ? ['MediaData'] : [], // 属性表cell显示 查看 按钮
      buttonTitles = this.isMediaLayer ? [getLanguage(global.language).Map_Tools.VIEW] : []
    let buttonActions = this.isMediaLayer ? [
      async data => {
        let layerName = this.props.currentLayer.name,
          geoID = data.rowData[1].value
        if(this.total === 1 && this.state.attributes.data.length === 1){
          geoID = data.rowData[0].value
        }
        let has = await SMediaCollector.haveMediaInfo(layerName, geoID)
        if(!has){
          Toast.show(getLanguage(global.language).Prompt.AFTER_COLLECT)
          return
        }
        let info = await SMediaCollector.getMediaInfo(layerName, geoID)
        let layerType = LayerUtils.getLayerType(this.props.currentLayer)
        let isTaggingLayer = layerType === 'TAGGINGLAYER'
        if(isTaggingLayer){
          Object.assign(info, { addToMap: this.props.currentLayer.isVisible })
        }else{
          Object.assign(info, { addToMap: false })
        }

        let refresh = mData => {
          if (!mData) return
          let _data = this.state.attributes.data[data.rowIndex]
          let isDelete = false
          for (let _mData of mData) {
            if (_mData.name === 'mediaFilePaths' && _mData.value.length === 0) {
              isDelete = true
              break
            }
            for (let i = 0; i < _data.length; i++) {
              if (_data[i].name !== _mData.name) continue
              if (_data[i].value === _mData.value) break
              let isSingle = this.total === 1 && this.state.attributes.data.length === 1
              let params = {}
              if (isSingle) {
                params = {
                  cellData: _data[i].value,
                  columnIndex: 1,
                  rowData: data.rowData[i],
                  index: i,
                  value: _mData.value instanceof Array ? _mData.value.toString() : _mData.value,
                }
              } else {
                params = {
                  cellData: _data[i],
                  columnIndex: i + 1,
                  rowData: data.rowData,
                  index: data.rowIndex,
                  value: _mData.value instanceof Array ? _mData.value.toString() : _mData.value,
                }
              }
              this.changeAction(params)
            }
          }
          if (isDelete) {
            this.setState({currentIndex:-1})
            this.table.setSelected(data.rowIndex)
            this.refresh()
          }else{
            this.refresh()
          }
        }

        // const mediaData = info.mediaData && JSON.parse(info.mediaData)
        // if (mediaData?.type === 'AI_CLASSIFY') {
        //   NavigationService.navigate('ClassifyResultEditView', {
        //     layerName: layerName,
        //     geoID: geoID,
        //     datasourceAlias: this.props.currentLayer.datasourceAlias,
        //     datasetName: this.props.currentLayer.datasetName,
        //     imagePath: await FileTools.appendingHomeDirectory(info.mediaFilePaths[0]),
        //     mediaName: mediaData.mediaName,
        //     classifyTime: info.modifiedDate,
        //     description: info.description,
        //     cb: refresh,
        //   })
        // } else {
        NavigationService.navigate('MediaEdit', {
          info,
          cb: refresh,
        })
        // }

      },
    ] : []
    const dismissTitles = ['MediaFilePaths', 'MediaServiceIds']
    const isSingle = this.total === 1 && this.state.attributes.data.length === 1
    return (
      <LayerAttributeTable
        ref={ref => (this.table = ref)}
        data={
          isSingle
            ? this.state.attributes.data[0]
            : this.state.attributes.data
        }
        tableHead={
          isSingle
            ? [
              getLanguage(this.props.language).Map_Label.NAME,
              getLanguage(this.props.language).Map_Label.ATTRIBUTE,
            ]
            : this.state.attributes.head
        }
        widthArr={isSingle && [100, 100]}
        type={
          isSingle
            ? LayerAttributeTable.Type.SINGLE_DATA
            : LayerAttributeTable.Type.MULTI_DATA
        }
        // indexColumn={this.state.attributes.data.length > 1 ? 0 : -1}
        indexColumn={0}
        hasIndex={this.state.attributes.data.length > 1}
        startIndex={
          isSingle
            ? -1
            : this.state.startIndex + 1
        }
        contentContainerStyle={{ backgroundColor: color.bgW }}
        hasInputText={this.state.attributes.data.length > 1}
        selectRow={this.selectRow}
        refresh={cb => this.refresh(cb)}
        loadMore={cb => this.loadMore(cb)}
        changeAction={this.changeAction}
        buttonNameFilter={buttonNameFilter}
        buttonActions={buttonActions}
        buttonTitles={buttonTitles}
        dismissTitles={dismissTitles}
        isShowSystemFields={this.state.isShowSystemFields}
        onPressHeader={this.onPressHeader}
        // bottomOffset={this.props.device.orientation.indexOf('LANDSCAPE') < 0 ? scaleSize(90) : scaleSize(0)}
        keyboardVerticalOffset={
          screen.getHeaderHeight(this.props.device.orientation) + scaleSize(130)
        }
      />
    )
  }

  renderEditControllerView = () => {
    const paddingBottom = screen.isIphoneX() && this.props.device.orientation.indexOf('LANDSCAPE') === 0 ? screen.X_BOTTOM_L : 0
    return (
      <View
        style={{
          width: '100%',
          height: scaleSize(100) + paddingBottom,
          ...screen.getIphonePaddingHorizontal(
            this.props.device.orientation,
          ),
        }}
      >
        <View
          style={[styles.editControllerView, {
            height: scaleSize(100) + paddingBottom,
            paddingBottom,
          }]}
        >
          <MTBtn
            key={'undo'}
            title={getLanguage(this.props.language).Map_Attribute.ATTRIBUTE_UNDO}
            //{'撤销'}
            style={styles.button}
            textColor={!this.state.canBeUndo && color.contentColorGray}
            image={
              this.state.canBeUndo
                ? getThemeAssets().edit.icon_undo
                : getThemeAssets().edit.icon_undo_ash
            }
            imageStyle={styles.headerBtn}
            onPress={() => this.setAttributeHistory('undo')}
          />
          <MTBtn
            key={'redo'}
            title={getLanguage(this.props.language).Map_Attribute.ATTRIBUTE_REDO}
            //{'恢复'}
            style={styles.button}
            textColor={!this.state.canBeRedo && color.contentColorGray}
            image={
              this.state.canBeRedo
                ? getThemeAssets().edit.icon_redo
                : getThemeAssets().edit.icon_redo_ash
            }
            imageStyle={styles.headerBtn}
            onPress={() => this.setAttributeHistory('redo')}
          />
          <MTBtn
            key={'revert'}
            title={
              getLanguage(this.props.language).Map_Attribute.ATTRIBUTE_REVERT
            }
            //{'还原'}
            style={styles.button}
            textColor={!this.state.canBeRevert && color.contentColorGray}
            image={
              this.state.canBeRevert
                ? getThemeAssets().edit.icon_back_off
                : getThemeAssets().edit.icon_back_off_ash
            }
            imageStyle={styles.headerBtn}
            onPress={() => this.setAttributeHistory('revert')}
          />
          <View style={styles.button} />
        </View>
      </View>
    )
  }

  renderInfoView = ({ image, title }) => {
    return (
      <InfoView
        image={image || getThemeAssets().attribute.info_no_attribute}
        title={title}
      />
    )
  }

  // renderContent = () => {
  //   if (!this.state.showTable) return null
  //   return (
  //     <View>
  //       <LayerTopBar
  //         canRelated={this.state.relativeIndex >= 0}
  //         locateAction={this.showLocationView}
  //         relateAction={this.relateAction}
  //       />
  //       <View
  //         style={{
  //           flex: 1,
  //           flexDirection: 'column',
  //           justifyContent: 'flex-start',
  //         }}
  //       >
  //         {this.renderMapLayerAttribute()}
  //         {this.type !== SINGLE_ATTRIBUTE && this.renderToolBar()}
  //         <LocationView
  //           ref={ref => (this.locationView = ref)}
  //           style={styles.locationView}
  //           relativeIndex={
  //             this.currentPage * PAGE_SIZE + this.state.relativeIndex
  //           }
  //           locateToTop={this.locateToTop}
  //           locateToBottom={this.locateToBottom}
  //           locateToPosition={this.locateToPosition}
  //         />
  //       </View>
  //     </View>
  //   )
  // }

  _renderHeader = () => {
    let itemWidth =
      this.props.device.orientation.indexOf('LANDSCAPE') === 0 ? 100 : 65
    let size =
      this.props.device.orientation.indexOf('LANDSCAPE') === 0 ? 40 : 50

    let buttons = []
    if (this.type !== 'MAP_3D') {
      buttons = [
        <MTBtn
          key={'attribute'}
          image={
            this.state.isShowSystemFields
              ? getThemeAssets().attribute.icon_attribute_hide
              : getThemeAssets().attribute.icon_attribute_show
          }
          imageStyle={{ width: scaleSize(size), height: scaleSize(size) }}
          onPress={this.showSystemFields}
        />,
        <MTBtn
          key={'undo'}
          image={getThemeAssets().nav.icon_nav_undo}
          imageStyle={{ width: scaleSize(size), height: scaleSize(size) }}
          onPress={this.showUndoView}
        />,
        <MTBtn
          key={'search'}
          image={getThemeAssets().nav.icon_nav_search}
          imageStyle={{ width: scaleSize(size), height: scaleSize(size) }}
          onPress={this.goToSearch}
        />,
      ]
    }
    return (
      <View
        style={{
          width: scaleSize(itemWidth * buttons.length),
          flexDirection: 'row',
          justifyContent: buttons.length === 1 ? 'flex-end' : 'space-between',
          alignItems: 'center',
        }}
      >
        {buttons}
      </View>
    )
  }

  render() {
    let showContent =
      this.state.showTable &&
      this.state.attributes &&
      this.state.attributes.head &&
      this.state.attributes.head.length > 0

    const dsDescription = LayerUtils.getDatasetDescriptionByLayer(this.props.currentLayer)

    //此处计算数据倒序时后实际上的数据index add jiakai
    let index
    if(this.state.descending){
      index = this.total - this.state.currentIndex -1
    }else{
      index = this.state.currentIndex
    }

    return (
      <Container
        ref={ref => (this.container = ref)}
        showFullInMap={true}
        headerProps={{
          title: this.props.mapModules.modules[
            this.props.mapModules.currentMapModule
          ].chunk?.title || '',
          navigation: this.props.navigation,
          // backAction: this.back,
          // backImg: require('../../../../assets/mapTools/icon_close.png'),
          headerTitleViewStyle: {
            // justifyContent: 'flex-start',
            // marginLeft: scaleSize(90),
          },
          withoutBack: true,
          headerRight: this._renderHeader(),
          isResponseHeader: true,
        }}
        bottomBar={this.type !== SINGLE_ATTRIBUTE && this.renderToolBar()}
        style={styles.container}
      >
        {this.type !== 'MAP_3D' && (
          <LayerTopBar
            orientation={this.props.device.orientation}
            hasAddField={!global.coworkMode}
            hasCamera={global.coworkMode && this.isMediaLayer || !global.coworkMode} // 协作中若原始数据不带多媒体的图层不能进行多媒体采集
            canLocated={this.state.attributes.data.length > 1}
            canRelated={this.state.currentIndex >= 0}
            canDelete={this.state.currentIndex >= 0}
            canAddField={
              !(global.coworkMode && dsDescription?.url && dsDescription?.type === 'onlineService') &&
              this.props.currentLayer.name !== undefined &&
              this.props.currentLayer.name !== '' &&
              this.props.currentLayer.type !== DatasetType.IMAGE &&
              this.props.currentLayer.type !== DatasetType.MBImage // 影像图层不能添加属性
            }
            locateAction={this.showLocationView}
            relateAction={this.relateAction}
            addFieldAction={this.showLayerAddView}
            deleteAction={this.deleteAction}
            attributesData={this.state.attributes.head}
            currentIndex={index}
            refreshAction={this.refreshAction}
            layerAttribute={true}
            attributes={this.state.attributes}
            // layerName={this.props.currentLayer.name}
            layerInfo={this.props.currentLayer}
            currentTask={this.props.currentTask}
            currentUser={this.props.currentUser}
          />
        )}
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-start',
            backgroundColor: color.bgW,
          }}
        >
          {showContent
            ? this.renderMapLayerAttribute()
            : this.renderInfoView({
              title: getLanguage(this.props.language).Prompt.NO_ATTRIBUTES,
              //'暂无属性',
            })}
          {/* {this.type !== SINGLE_ATTRIBUTE && this.renderToolBar()} */}
          <LocationView
            ref={ref => (this.locationView = ref)}
            style={styles.locationView}
            currentIndex={this.state.currentIndex}
            locateToTop={this.locateToTop}
            locateToBottom={this.locateToBottom}
            locateToPosition={this.locateToPosition}
          />
        </View>
        <PopModal
          ref={ref => (this.popModal = ref)}
          modalVisible={this.state.editControllerVisible}
        >
          {this.renderEditControllerView()}
        </PopModal>
        <LayerAttributeAdd
          ref={ref => (this.addPopModal = ref)}
          contentStyle={{
            height:
              this.props.device.orientation.indexOf('LANDSCAPE') >= 0
                ? '100%'
                : '80%',
            width:
              this.props.device.orientation.indexOf('LANDSCAPE') >= 0
                ? '40%'
                : '100%',
            right: 0,
            left:
              this.props.device.orientation.indexOf('LANDSCAPE') >= 0
                ? '60%'
                : 0,
          }}
          navigation={this.props.navigation}
          device={this.props.device}
          currentAttribute={this.props.currentAttribute}
          setCurrentAttribute={this.props.setCurrentAttribute}
          data={
            this.state.attributes.head.length > 1 &&
            this.state.attributes.head[this.state.attributes.head.length - 1]
          }
          addAttributeField={this.addAttributeField}
          backAction={() => {
            this.addPopModal && this.addPopModal.setVisible(false)
          }}
        />
        {this.renderDeleteFieldDialog()}
      </Container>
    )
  }
}

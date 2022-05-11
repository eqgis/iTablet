/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { ConstInfo, ChunkType } from '../../../../constants'
import { Toast, LayerUtils, scaleSize } from '../../../../utils'
import { color } from '../../../../styles'
import { LayerAttributeTable } from '../../components'
import { getLanguage } from '../../../../language'
import { PopoverButtonsView } from '../../../../components'
import { Rect } from 'react-native-popover-view'
import NavigationService from '../../../NavigationService'
import { SMediaCollector } from 'imobile_for_reactnative'
import { View } from 'react-native'

const PAGE_SIZE = 30
const ROWS_LIMIT = 120
const COL_HEIGHT = scaleSize(80)

export default class LayerSelectionAttribute extends React.Component {
  props: {
    navigation: Object,
    route: Object,
    // currentAttribute: Object,
    // currentLayer: Object,
    map: Object,
    layerSelection: Object,
    attributesHistory: Array,
    setCurrentAttribute: () => {},
    setLayerAttributes: () => {},
    setDataAttributes: () => {},
    setNaviAttributes: () => {},
    setLoading: () => {},
    selectAction: () => {},
    setAttributeHistory: () => {},
    showAddModal: () => {},
    onGetAttribute?: () => {},
    onGetToolVisible?: () => {},
    onAttributeFieldDelete?: () => {},
    isShowSystemFields: boolean,
    selection: Object,
    refreshCurrent: () => {},
    type?: String,
    datasetName?:String,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.route
    this.checkToolIsViable()
    this.state = {
      attributes: {
        head: [],
        data: [],
      },
      // tableTitle: [],
      tableHead: [],
      currentFieldInfo: [],
      startIndex: 0,
      relativeIndex: -1, // 当前页面从startIndex开始的被选中的index, 0 -> this.total - 1
      currentIndex: -1,
      isCollection:params && params.isCollection ? params.isCollection : false,
    }

    this.total = 0
    // this.currentFieldInfo = []
    // this.currentFieldIndex = -1
    this.currentPage = 0
    this.pageSize = 20
    this.isInit = true // 初始化，防止多次加载
    this.noMore = false // 判断是否加载完毕
    this.isLoading = false // 防止同时重复加载多次
    this.isMediaLayer = false // 是否是多媒体图层
    this.Popover = undefined // 长按弹窗
  }

  componentDidMount() {
    this.isInit = true
    // SMediaCollector.isMediaLayer(this.props.layerSelection.layerInfo.name).then(result => {
    //   this.isMediaLayer = result
    //   this.getAttribute()
    // }).catch(() =>{
    //   this.getAttribute()
    // })
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      JSON.stringify(nextState) !== JSON.stringify(this.state) ||
      JSON.stringify(nextProps.map) !== JSON.stringify(this.props.map) ||
      JSON.stringify(nextProps.layerSelection) !==
        JSON.stringify(this.props.layerSelection) ||
      JSON.stringify(nextProps.attributesHistory) !==
        JSON.stringify(nextProps.attributesHistory) ||
      this.props.isShowSystemFields !== nextProps.isShowSystemFields || global.NEEDREFRESHTABLE
    ) {
      return true
    }
    return false
  }

  componentDidUpdate(prevProps) {
    if (
      global.NEEDREFRESHTABLE || (
        prevProps.layerSelection &&
        JSON.stringify(prevProps.layerSelection) !==
        JSON.stringify(this.props.layerSelection)
      )
    ) {
      // global.NEEDREFRESHTABLE 在搜索页修改了数据时 为true
      global.NEEDREFRESHTABLE = false
      SMediaCollector.isMediaLayer(this.props.layerSelection.layerInfo.name).then(result => this.isMediaLayer = result)
      let checkData = this.checkToolIsViable()
      // this.isInit = true
      this.currentPage = 0
      this.total = 0 // 属性总数
      this.canBeRefresh = true
      this.noMore = false
      // this.getAttribute()
      this.setState(
        {
          attributes: {
            head: [],
            data: [],
          },
          currentFieldInfo: [],
          relativeIndex: -1,
          currentIndex: -1,
          startIndex: 0,
          ...checkData,
        },
        () => {
          this.refresh(null, true)
        },
      )
    }
  }

  componentWillUnmount() {
    this.props.setCurrentAttribute({})
  }

  setLoading = (isLoading, info) => {
    if (this.props.setLoading && typeof this.props.setLoading === 'function') {
      this.props.setLoading(isLoading, info)
    }
  }

  getAttribute = async (params = {}, cb = () => {}, resetCurrent = false) => {
    if (this.props.type !== 'NAVIGATION' && this.props.type !== 'MY_DATA' && !this.state.isCollection&&(!this.props.layerSelection.layerInfo.path || params.currentPage < 0))
      return
    let { currentPage, pageSize, type, ...others } = params
    // this.isLoading = true
    // ;(async function() {
    try {
      let result
      if(this.props.type === 'MY_DATA'){
        result = await LayerUtils.getSelectionAttributeByData(
          JSON.parse(JSON.stringify(this.state.attributes)),
          this.props.datasetName,
          currentPage,
          pageSize !== undefined ? pageSize : PAGE_SIZE,
          type,
          true,
        )
      }else if(this.props.type === 'NAVIGATION'){
        result = await LayerUtils.getNavigationAttributeByData(
          JSON.parse(JSON.stringify(this.state.attributes)),
          this.props.datasetName,
          currentPage,
          pageSize !== undefined ? pageSize : PAGE_SIZE,
          type,
          true,
        )
      }else if(this.state.isCollection){
        result = await LayerUtils.getSelectionAttributeByLayer(
          JSON.parse(JSON.stringify(this.state.attributes)),
          global.currentLayer.name,
          currentPage,
          pageSize !== undefined ? pageSize : PAGE_SIZE,
          type,
          true,
        )
      }else{
        result = await LayerUtils.getSelectionAttributeByLayer(
          JSON.parse(JSON.stringify(this.state.attributes)),
          this.props.layerSelection.layerInfo.path,
          currentPage,
          pageSize !== undefined ? pageSize : PAGE_SIZE,
          type,
        )
      }

      this.total = result.total || 0
      let attributes = result.attributes || []

      //我的里面进入查看属性，没有选择图层
      if(this.props.type !== 'MY_DATA' || this.props.type !== 'NAVIGATION'){
        this.isMediaLayer = await SMediaCollector.isMediaLayer(this.props.layerSelection.layerInfo.name)
      }

      if (!attributes.data || attributes.data.length === 1) {
        if (!attributes.data) {
          attributes = {
            head: [],
            data: [],
          }
        }
        this.setState({
          showTable: true,
          attributes,
          currentIndex: 0,
          relativeIndex: 0,
          currentFieldInfo: !attributes.data ? [] : attributes.data[0],
          startIndex: 0,
          ...others,
        })
        this.setLoading(false)
        this.isLoading = false
        this.props.onGetAttribute && this.props.onGetAttribute(attributes)
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
        // let startIndex = others.startIndex || this.state.startIndex || 0
        let currentIndex = resetCurrent
          ? -1
          : others.currentIndex !== undefined
            ? others.currentIndex
            : this.state.currentIndex
        let relativeIndex =
          resetCurrent || currentIndex < 0 ? -1 : currentIndex - startIndex
        let prevStartIndex = this.state.startIndex
        this.currentPage = Math.floor(
          (startIndex + newAttributes.data.length - 1) / PAGE_SIZE,
        )
        // this.noMore = Math.floor(this.total / PAGE_SIZE) <= this.currentPage
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
              this.isLoading = false
              this.setLoading(false)
              this.props.onGetAttribute &&
                this.props.onGetAttribute(attributes)
              cb && cb(attributes)
            }, 0)
          },
        )
      }
    } catch (e) {
      cb && cb()
      this.isLoading = false
      this.setLoading(false)
    }
    // }.bind(this)())
  }

  /** 下拉刷新 **/
  refresh = (cb = () => {}, resetCurrent = false) => {
    if (!this.canBeRefresh) {
      //Toast.show('已经是最新的了')
      cb && cb()
      return
    }
    let startIndex = this.state.startIndex - PAGE_SIZE
    if (startIndex <= 0) {
      startIndex = 0
      this.canBeRefresh = false
    }
    let currentPage = startIndex / PAGE_SIZE
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
  loadMore = (cb = () => {}) => {
    if (this.isLoading) return
    // if (
    //   this.isInit ||
    //   this.noMore ||
    //   this.props.layerSelection.ids.length <= 20
    // ) {
    //   cb && cb()
    //   return
    // }
    if (this.noMore) {
      cb && cb()
      return
    }
    this.isLoading = true
    if (this.state.attributes.data.length === 0) {
      this.currentPage = 0
    } else {
      this.currentPage += 1
    }
    this.getAttribute(
      {
        type: 'loadMore',
        currentPage: this.currentPage,
      },
      attribute => {
        cb && cb()
        this.isLoading = false
        this.canBeRefresh = this.state.startIndex > 0
        if (!attribute || !attribute.data || attribute.data.length <= 0) {
          this.noMore = true
          Toast.show(ConstInfo.ALL_DATA_ALREADY_LOADED)
          // this.currentPage--
        }
      },
    )
  }

  /**
   * 定位到首位
   */
  locateToTop = (cb = () => {}) => {
    if (this.state.attributes.data.length === 0 || this.total <= 0) {
      Toast.show(getLanguage(global.language).Prompt.CANNOT_LOCATION)
      //ConstInfo.CANNOT_LOCATION)
      return
    }
    this.setLoading(true, getLanguage(global.language).Prompt.LOCATING)
    // ConstInfo.LOCATING)
    this.currentPage = 0
    if (this.state.startIndex === 0) {
      this.setState(
        {
          relativeIndex: 0,
          currentIndex: 0,
          // currentFieldInfo: this.state.attributes.data[0],
        },
        () => {
          let item = this.table.setSelected(0, false)
          cb &&
            cb({
              currentIndex: 0,
              currentFieldInfo: item.data,
              layerInfo: this.props.layerSelection.layerInfo,
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
            cb &&
              cb({
                currentIndex: 0,
                currentFieldInfo: item.data,
                layerInfo: this.props.layerSelection.layerInfo,
              })
            this.canBeRefresh = false
            this.table &&
              this.table.scrollToLocation({
                animated: true,
                itemIndex: 0,
                sectionIndex: 0,
                viewPosition: 0,
              })
          }, 0)
        },
      )
    }
  }

  /**
   * 定位到末尾
   */
  locateToBottom = (cb = () => {}) => {
    if (this.state.attributes.data.length === 0 || this.total <= 0) {
      Toast.show(getLanguage(global.language).Prompt.CANNOT_LOCATION)
      // ConstInfo.CANNOT_LOCATION)
      return
    }
    this.setLoading(true, getLanguage(global.language).Prompt.LOCATING)
    // ConstInfo.LOCATING)
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
            cb &&
              cb({
                currentIndex: this.total - 1,
                currentFieldInfo: item.data,
                layerInfo: this.props.layerSelection.layerInfo,
              })
            this.table &&
              this.table.scrollToLocation({
                animated: true,
                itemIndex: remainder,
                sectionIndex: 0,
                viewOffset: 0,
                viewPosition: 1,
              })
          }
        }, 100)
      },
    )
  }

  /**
   * 定位到指定位置（相对/绝对 位置）
   * @param data {value, inputValue}
   */
  locateToPosition = (data = {}, cb = () => {}) => {
    if (this.state.attributes.data.length === 0 || this.total <= 0) {
      Toast.show(getLanguage(global.language).Prompt.CANNOT_LOCATION)
      //ConstInfo.CANNOT_LOCATION)
      return
    }
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
    // if (this.currentPage > 0) {
    //   this.canBeRefresh = true
    // }

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
          if (this.table) {
            // 避免 Android 更新数据后无法滚动
            setTimeout(() => {
              let item = this.table.setSelected(relativeIndex, false)
              this.setState(
                {
                  currentFieldInfo: item.data,
                },
                () => {
                  cb &&
                    cb({
                      currentIndex,
                      currentFieldInfo: item.data,
                      layerInfo: this.props.layerSelection.layerInfo,
                    })
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
            // 避免 Android 更新数据后无法滚动
            setTimeout(() => {
              let item = this.table.setSelected(relativeIndex, false)
              this.setState(
                {
                  currentFieldInfo: item.data,
                },
                () => {
                  cb &&
                    cb({
                      currentIndex,
                      currentFieldInfo: item.data,
                      layerInfo: this.props.layerSelection.layerInfo,
                    })
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
        },
      )
    }
  }

  selectRow = ({ data, index = -1 }) => {
    if (this.state.attributes.data.length === 1) return
    // if (!data || index < 0) return
    // this.currentFieldInfo = data || []
    // this.currentFieldIndex = index >= 0 ? index : -1

    this.setState({
      currentFieldInfo: data || [],
      relativeIndex: index >= 0 ? index : -1,
      currentIndex: this.state.startIndex + index,
    })
    if (
      this.props.selectAction &&
      typeof this.props.selectAction === 'function'
    ) {
      this.props.selectAction({
        index: this.state.startIndex + index,
        data,
        layerInfo: this.props.layerSelection.layerInfo,
      })
    }
  }

  getAttributes = () => {
    return this.state.attributes
  }

  getSelection = () => {
    if (this.state.attributes.data.length === 1) {
      return {
        data: this.state.attributes.data[0],
        index: 0,
      }
    } else {
      return {
        data: this.state.attributes.data[this.state.relativeIndex],
        index: this.state.relativeIndex,
      }
    }
  }

  // 隐藏系统属性时，横向滚动到最左边
  horizontalScrollToStart = () => {
    this.table && this.table.horizontalScrollToStart({ x: 0, animated: false })
  }

  //显示详情和删除的弹框
  _showPopover = (pressView, index, fieldInfo) => {
    let items = []

    items = [
      {
        title: global.language === 'CN' ? '详情' : 'Detail',
        onPress: () => {
          (async function() {
            this.props.showAddModal && this.props.showAddModal(true, {
              data: {fieldInfo},
              isDetail: true,
            })
          }.bind(this)())
        },
      },
    ]
    let tempStr = fieldInfo.caption.toLowerCase()
    let isSystemField = tempStr.substring(0, 2) == 'sm'
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
          if (
            this.props.onAttributeFieldDelete &&
            typeof this.props.onAttributeFieldDelete === 'function'
          ) {
            this.props.onAttributeFieldDelete(fieldInfo)
          }
        },
      })
    }
    if (pressView) {
      pressView.measure((ox, oy, width, height, px, py) => {
        this.Popover?.setVisible(true, new Rect(px + 1, py + 1, width, height), items)
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

  /** 清除表格选中状态 **/
  clearSelection = () => {
    if (this.table) {
      this.table.clearSelected()
      this.setState({
        currentFieldInfo: [],
        relativeIndex: -1,
        currentIndex: -1,
      })
      // if (
      //   this.props.selectAction &&
      //   typeof this.props.selectAction === 'function'
      // ) {
      //   this.props.selectAction({
      //     index: -1,
      //     data: -1,
      //   })
      // }
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
          if (
            layerHistory[j].layerPath ===
            this.props.layerSelection.layerInfo.path
          ) {
            historyObj = layerHistory[j]
            break
          }
        }
        break
      }
    }

    this.canBeUndo = LayerUtils.canBeUndo(historyObj)
    this.canBeRedo = LayerUtils.canBeRedo(historyObj)
    this.canBeRevert = LayerUtils.canBeRevert(historyObj)

    if (
      this.props.onGetToolVisible &&
      typeof this.props.onGetToolVisible === 'function'
    ) {
      this.props.onGetToolVisible({
        canBeUndo: this.canBeUndo,
        canBeRedo: this.canBeRedo,
        canBeRevert: this.canBeRevert,
      })
    }
  }

  getToolIsViable = () => {
    return {
      canBeUndo: this.canBeUndo,
      canBeRedo: this.canBeRedo,
      canBeRevert: this.canBeRevert,
    }
  }

  /** 修改表格中的值的回调 **/
  changeAction = data => {
    if (
      this.props.setLayerAttributes &&
      typeof this.props.setLayerAttributes === 'function'
    ) {
      // 单个对象属性和多个对象属性数据有区别
      let isSingleData = this.state.attributes.data.length === 1
      // 单个对象属性 在 隐藏系统字段下，要重新计算index
      if (isSingleData && !this.state.isShowSystemFields) {
        for (let index in this.state.attributes.data[0]) {
          if (this.state.attributes.data[0][index].name === data.rowData.name) {
            data.index = index
          }
        }
      }
      if(this.props.type === 'MY_DATA'){
        this.props
          .setDataAttributes([
            {
              mapName: this.props.map.currentMap.name,
              layerPath: this.props.layerSelection.layerInfo.path,
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
            // 成功修改属性后，更新数据
            let attributes = JSON.parse(JSON.stringify(this.state.attributes))
            // 如果有序号，column.index要 -1
            // let column = this.state.attributes.data.length > 1 ? (data.columnIndex - 1) : data.columnIndex
            if (result) {
              if (this.state.attributes.data.length > 1) {
                attributes.data[data.index][data.columnIndex - 1].value =
                  data.value
              } else {
                attributes.data[0][data.index].value = data.value
              }
            } else {
              Toast.show(getLanguage(this.props.language).Prompt.INVALID_DATA_SET_FAILED)
            }

            this.checkToolIsViable()
            this.setState({
              attributes,
            })
          })
      }else if(this.props.type === 'NAVIGATION'){
        this.props
          .setNaviAttributes([
            {
              mapName: this.props.map.currentMap.name,
              layerPath: this.props.layerSelection.layerInfo.path,
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
            // 成功修改属性后，更新数据
            let attributes = JSON.parse(JSON.stringify(this.state.attributes))
            // 如果有序号，column.index要 -1
            // let column = this.state.attributes.data.length > 1 ? (data.columnIndex - 1) : data.columnIndex
            if (result) {
              if (this.state.attributes.data.length > 1) {
                attributes.data[data.index][data.columnIndex - 1].value =
                  data.value
              } else {
                attributes.data[0][data.index].value = data.value
              }
            } else {
              Toast.show(getLanguage(this.props.language).Prompt.INVALID_DATA_SET_FAILED)
            }

            this.checkToolIsViable()
            this.setState({
              attributes,
            })
          })
      }else{
        this.props
          .setLayerAttributes([
            {
              mapName: this.props.map.currentMap.name,
              layerPath: this.props.layerSelection.layerInfo.path,
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
            // 成功修改属性后，更新数据
            let attributes = JSON.parse(JSON.stringify(this.state.attributes))
            // 如果有序号，column.index要 -1
            // let column = this.state.attributes.data.length > 1 ? (data.columnIndex - 1) : data.columnIndex
            if (result) {
              if (this.state.attributes.data.length > 1) {
                attributes.data[data.index][data.columnIndex - 1].value =
                  data.value
              } else {
                attributes.data[0][data.index].value = data.value
              }
            } else {
              Toast.show(getLanguage(this.props.language).Prompt.INVALID_DATA_SET_FAILED)
            }

            this.checkToolIsViable()
            this.setState({
              attributes,
            })
          })
      }
    }
  }

  setAttributeHistory = async type => {
    if (!type) return
    switch (type) {
      case 'undo':
        if (!this.canBeUndo) {
          // Toast.show('已经无法回撤')
          // this.setLoading(false)
          return
        }
        break
      case 'redo':
        if (!this.canBeRedo) {
          // Toast.show('已经无法恢复')
          // this.setLoading(false)
          return
        }
        break
      case 'revert':
        if (!this.canBeRevert) {
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
            layerPath: this.props.layerSelection.layerInfo.path,
            type,
          })
          .then(({ msg, result, data }) => {
            if (!msg === '成功') Toast.show(msg)
            if (result) {
              let attributes = JSON.parse(JSON.stringify(this.state.attributes))

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
                          // this.checkToolIsViable()
                          // this.setState({
                          //   attributes,
                          // })
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
              this.checkToolIsViable()
              this.setState(
                {
                  attributes,
                },
                () => {
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

  renderTable = () => {
    global.layerSelection = this.props.layerSelection
    // let buttonNameFilter = this.isMediaLayer ? ['MediaFilePaths', 'MediaServiceIds', 'MediaData'] : [], // 属性表cell显示 查看 按钮
    //   buttonTitles = this.isMediaLayer ? [getLanguage(global.language).Map_Tools.VIEW, getLanguage(global.language).Map_Tools.VIEW, getLanguage(global.language).Map_Tools.VIEW] : []
    let buttonNameFilter = this.isMediaLayer ? ['MediaData'] : [], // 属性表cell显示 查看 按钮
      buttonTitles = this.isMediaLayer ? [getLanguage(global.language).Map_Tools.VIEW] : []
    let buttonActions = this.isMediaLayer ? [
      async data => {
        let layerName = this.props.layerSelection.layerInfo.name,
          geoID = data.rowData[1].value
        if (this.props.layerSelection.ids.length === 1) {
          geoID = data.rowData[0].value
        }
        let has = await SMediaCollector.haveMediaInfo(layerName, geoID)
        if (!has) {
          Toast.show(getLanguage(global.language).Prompt.AFTER_COLLECT)
          return
        }
        let info = await SMediaCollector.getMediaInfo(layerName, geoID)
        let layerType = LayerUtils.getLayerType(global.currentLayer)
        let isTaggingLayer = layerType === 'TAGGINGLAYER'
        if(isTaggingLayer){
          Object.assign(info, { addToMap: global.currentLayer.isVisible })
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
                  value: _mData.value,
                }
              } else {
                params = {
                  cellData: _data[i],
                  columnIndex: i + 1,
                  rowData: data.rowData,
                  index: data.rowIndex,
                  value: _mData.value,
                }
              }
              this.changeAction(params)
            }
          }
          if (isDelete) {
            this.setState({currentIndex:-1})
            this.refresh()
          }
        }

        // const mediaData = info.mediaData && JSON.parse(info.mediaData)
        // if (mediaData?.type === 'AI_CLASSIFY') {
        //   NavigationService.navigate('ClassifyResultEditView', {
        //     layerName: layerName,
        //     geoID: geoID,
        //     datasourceAlias: global.currentLayer.datasourceAlias,
        //     datasetName: global.currentLayer.datasetName,
        //     imagePath: await FileTools.appendingHomeDirectory(info.mediaFilePaths[0]),
        //     mediaName: mediaData.mediaName,
        //     classifyTime: info.modifiedDate,
        //     description: info.description,
        //     cb: refresh,
        //   })
        // } else {
        NavigationService.navigate('MediaEdit', {
          info,
          layerInfo: global.currentLayer,
          cb: refresh,
          gocb:()=>{
            NavigationService.goBack()
            global.HAVEATTRIBUTE = false
          },
        })
        // }
      },
    ] : []
    const dismissTitles = ['MediaFilePaths', 'MediaServiceIds']
    const isSingle = this.state.attributes.data.length === 1
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
        refresh={cb => this.refresh(cb)}
        loadMore={cb => this.loadMore(cb)}
        hasInputText={this.state.attributes.data.length > 1}
        changeAction={this.changeAction}
        indexColumn={0}
        hasIndex={this.state.attributes.data.length > 1}
        startIndex={
          isSingle
            ? -1
            : this.state.startIndex + 1
        }
        contentContainerStyle={{backgroundColor: color.bgW}}
        selectRow={this.selectRow}
        buttonNameFilter={buttonNameFilter}
        buttonActions={buttonActions}
        buttonTitles={buttonTitles}
        dismissTitles={dismissTitles}
        isShowSystemFields={this.props.isShowSystemFields}
        onPressHeader={this.onPressHeader}
      />
    )
  }

  render() {
    return (
      <View style={{flex: 1}}>
        {this.renderTable()}
        <PopoverButtonsView
          ref={ref => this.Popover = ref}
          backgroundStyle={{backgroundColor: 'rgba(0, 0, 0, 0)'}}
          popoverStyle={{backgroundColor: 'rgba(0, 0, 0, 1)'}}
        />
      </View>
    )
  }
}

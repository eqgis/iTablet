/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  SectionList,
  Platform,
} from 'react-native'
import { scaleSize, dataUtil } from '../../../../utils'
import { IndicatorLoading } from '../../../../components'
import { color } from '../../../../styles'
import Row from './Row'

import styles from './styles'
import { getLanguage } from '../../../../language'

const COL_HEIGHT = scaleSize(80)

export default class LayerAttributeTable extends React.Component {
  props: {
    refresh?: () => {},
    loadMore?: () => {},
    selectRow?: () => {},
    changeAction?: () => {}, // 修改表格中的值的回调
    onPressHeader?: () => {}, // 点击属性字段的回调
    onViewableItemsChanged?: () => {},
    buttonNameFilter?: Array, // Cell 为button的列的filter
    buttonActions?: Array, // Cell 为button的列的点击事件
    buttonTitles?: Array, // Cell 为button列对应的title, buttonTitles必须不为空，buttonIndexes才生效
    dismissTitles?: Array, // 隐藏的元素
  
    contentContainerStyle?: Object,

    selectable: boolean,
    stickySectionHeadersEnabled?: boolean,
    multiSelect: boolean, // 是否多选
    indexColumn?: number, // 每一行index所在的列，indexColumn >= 0 则所在列为Text

    tableHead: Array,
    tableTitle: Array,
    tableData: any,
    indexCellStyle: any,
    indexCellTextStyle: any,
    widthArr: Array,
    colHeight: number,
    type: string,
    data: Array,
    hasIndex?: boolean,
    startIndex?: number,
    isShowSystemFields?: boolean,
    // bottomOffset?: number,
    keyboardVerticalOffset?: number,
  }

  static defaultProps = {
    type: 'ATTRIBUTE',
    tableHead: [],
    tableTitle: [],
    tableData: [],
    widthArr: [40, 200, 200, 100, 100, 100, 80],
    data: [],
    selectable: true,
    multiSelect: false,
    hasIndex: false,
    startIndex: -1,
    refreshing: false,
    stickySectionHeadersEnabled: true,
    indexColumn: -1,
    // bottomOffset: 0,
    keyboardVerticalOffset: 0,
  }

  constructor(props) {
    super(props)
    // let { dataList, colHeight } = this.dealData(props.tableTitle, props.data)
    const titles =
      props.tableTitle && props.tableTitle.length > 0 ? props.tableTitle : this.getTitle(props.data)

    const isMultiData = this.props.type === 'MULTI_DATA'
    // this.props.data instanceof Array &&
    // (this.props.data.length === 0 ||
    //   (this.props.data.length > 1 && this.props.data[0] instanceof Array))

    this.state = {
      colHeight: COL_HEIGHT,
      widthArr: props.widthArr,
      tableTitle: titles,
      tableHead: props.tableHead,
      // tableTitle: titleList,
      // tableData: dataList,
      tableData: [
        {
          title: titles,
          data:
            props.data instanceof Array ? dataUtil.cloneObj(props.data) : [],
        },
      ],
      selected: (new Map(): Map<string, boolean>),
      currentSelect: -1,
      refreshing: false,
      loading: false,
    }
    this.canBeLoadMore = true // 控制是否可以加载更多
    this.isScrolling = false // 防止连续定位滚动
    this.itemClickPosition = 0 //当前item点击位置 IOS
    try {
      this.setIndexexes(titles)
    } catch(e) {
      // eslint-disable-next-line no-console
      __DEV__ && console.warn(e)
      this.dismissIndexes = []
      this.buttonIndexes = []
    }
  }

  /**
   * 设置属性表中 按钮/隐藏 Cell的index
   */
  setIndexexes = (titles = []) => {
    try {
      if (titles.length > 1 && titles[1].value?.toString().toLowerCase() === 'smid') {
        titles = titles.splice(1) // 去除第一个是'序号'的titles数据,第一个title位smid
      }
      this.dismissIndexes = []
      this.buttonIndexes = []
      if (this.props.type === 'MULTI_DATA') {
        for (let index in titles) {
          if (this.props.dismissTitles && this.props.dismissTitles instanceof Array) {
            const dismissIndex = this.props.dismissTitles?.indexOf(titles[index].value)
            if (dismissIndex >= 0) this.dismissIndexes.push(parseInt(index) + 1)
          }
          if (this.props.buttonNameFilter && this.props.buttonNameFilter instanceof Array) {
            const buttonIndex = this.props.buttonNameFilter?.indexOf(titles[index].value)
            if (buttonIndex >= 0) this.buttonIndexes.push(parseInt(index) + 1)
          }
        }
      } else {
        for (let index in this.props.data) {
          const dismissIndex = this.props.dismissTitles.indexOf(this.props.data[index].name)
          if (dismissIndex >= 0) this.dismissIndexes.push(parseInt(index))
        }
      }
    } catch(e) {
      // eslint-disable-next-line no-console
      __DEV__ && console.warn(e)
      this.dismissIndexes = []
      this.buttonIndexes = []
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.keyboardVerticalOffset !== nextProps.keyboardVerticalOffset ||
      JSON.stringify(nextState) !== JSON.stringify(this.state) ||
      nextProps.isShowSystemFields !== this.props.isShowSystemFields ||
      JSON.stringify(nextProps.tableTitle) !==
        JSON.stringify(this.props.tableTitle) ||
      JSON.stringify(nextProps.data) !== JSON.stringify(this.props.data) ||
      JSON.stringify(nextProps.tableHead) !==
        JSON.stringify(this.props.tableHead) ||
      JSON.stringify([...this.state.selected]) !==
        JSON.stringify([...nextState.selected])
    ) {
      return true
    }
    return false
  }

  componentDidMount() {
    // this.scrollToLocation({}) // 防止初始化iOS顶部显示RefreshControl空白高度
  }

  componentDidUpdate(prevProps) {
    try {
      const isMultiData = this.props.type === 'MULTI_DATA'
      if (
        JSON.stringify(prevProps.tableTitle) !==
          JSON.stringify(this.props.tableTitle) ||
        JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data) ||
        (!isMultiData &&
          this.props.isShowSystemFields !== prevProps.isShowSystemFields) ||
        JSON.stringify(this.state.tableHead) !==
          JSON.stringify(this.props.tableHead)
      ) {
        let data = []
        const titles = this.getTitle(this.props.data)
        this.setIndexexes(titles)

        if (!isMultiData && !this.props.isShowSystemFields) {
          this.props.data.forEach(item => {
            if (!this._isSystomField(item.fieldInfo)) {
              data.push(item)
            }
          })
        } else {
          data = this.props.data
        }

        this.setState({
          colHeight: COL_HEIGHT,
          widthArr: this.props.widthArr,
          tableData: [
            {
              title: titles,
              data,
            },
          ],
          tableHead: this.props.tableHead,
          isMultiData,
        })
        if (prevProps.data && this.props.data && this.props.data.length < prevProps.data.length) {
          this.table &&
            this.table.scrollToLocation({
              animated: false,
              itemIndex: 0,
              sectionIndex: 0,
              viewOffset: COL_HEIGHT,
            })
        }
      }
    } catch(e) {
      // eslint-disable-next-line no-console
      __DEV__ && console.warn(e)
    }
  }

  _isSystomField = fieldInfo => {
    return fieldInfo?.isSystemField || fieldInfo?.name?.toUpperCase().indexOf('SS_') === 0 || fieldInfo?.name?.toUpperCase().indexOf('SM') === 0
  }


  //IOS avoidingView无效 手动滚动过去
  // componentDidMount() {
  //   if (Platform.OS === 'ios') {
  //     this.keyBoardDidShowListener = Keyboard.addListener(
  //       'keyboardDidShow',
  //       this._keyboardDidShow,
  //     )
  //   }
  // }
  // componentWillUnmount() {
  //   if (Platform.OS === 'ios') {
  //     this.keyBoardDidShowListener.remove()
  //   }
  // }
  // _keyboardDidShow = e => {
  //   let keyboardCoordinates = e.endCoordinates
  //   if ((keyboardCoordinates.screenY - keyboardCoordinates.height - COL_HEIGHT) < this.itemClickPosition && this.scrollIndex >= 0 && this.table) {
  //     UIManager.measure(findNodeHandle(this.table), (x, y, width, height) => {
  //       this.table.scrollToLocation({
  //         itemIndex: this.scrollIndex,
  //         viewPosition: 0,
  //         viewOffset: height - keyboardCoordinates.height + this.props.bottomOffset - COL_HEIGHT,
  //       })
  //     });
  //   }
  // }

  // 隐藏系统属性时，横向滚动到最左边
  horizontalScrollToStart = () => {
    this.horizontalTable &&
      this.horizontalTable.scrollTo({ x: 0, animated: false })
  }

  scrollToLocation = params => {
    if (!params) return
    // 防止2秒内连续定位滚动
    if (this.table && !this.isScrolling) {
      this.isScrolling = true
      this.table.scrollToLocation({
        animated: params.animated || false,
        itemIndex: params.itemIndex || 0,
        sectionIndex: params.sectionIndex || 0,
        viewOffset:
          params.viewOffset !== undefined ? params.viewOffset : COL_HEIGHT,
        viewPosition: params.viewPosition || 0,
      })
      let timer = setTimeout(() => {
        this.isScrolling = false
        clearTimeout(timer)
      }, 1000)
    }
  }

  getSelected = () => {
    return this.state.selected
  }

  clearSelected = () => {
    let _selected = new Map(this.state.selected)
    _selected.clear()
    this.setState({
      selected: _selected,
    })
  }

  getTitle = () => {
    // let titleList = []
    // if (data instanceof Array && data.length > 1 && data[0] instanceof Array) {
    //   data[0].forEach(item => {
    //     titleList.push(item.name)
    //   })
    // } else {
    let titleList = this.props.tableHead
    // }

    return titleList
  }

  refresh = () => {
    if (this.props.refresh && typeof this.props.refresh === 'function') {
      this.setState({
        refreshing: true,
      })
      this.props.refresh(() => {
        this.setState({
          refreshing: false,
        })
      })
    }
  }

  loadMore = () => {
    if (
      this.canBeLoadMore &&
      this.props.loadMore &&
      typeof this.props.loadMore === 'function' &&
      !this.state.loading
    ) {
      this.setState(
        {
          loading: true,
        },
        () => {
          // if (this.state.tableData[0].data && this.state.tableData[0].data.length > 0) {
          //   this.table && this.table.scrollToLocation({
          //     viewPosition: 1,
          //     sectionIndex: 0,
          //     itemIndex: this.state.tableData[0].data.length - 1,
          //     viewOffset: COL_HEIGHT,
          //   })
          // }
        },
      )
      this.props.loadMore(() => {
        this.canBeLoadMore = false
        this.setState({
          loading: false,
        })
      })
    }
  }

  /**
   * 设置/取消 选择行
   * index:    行序号
   * isToggle: 若行已被选中，是否取消被选择状态
   **/
  setSelected = (index, isToggle = true, cb?: () => void) => {
    if (index === undefined || isNaN(index) || index < 0) return
    let _value = this.state.tableData?.[0]?.data?.[index]?.[0]?.value
    if (
      isToggle ||
      !this.state.selected.get(_value)
    ) {
      this.setState(state => {
        // copy the map rather than modifying state.
        const selected = new Map(state.selected)
        const target = selected.get(
          _value,
        )
        if (!this.props.multiSelect && !target) {
          // 多选或者点击已选行
          selected.clear()
        }

        selected.set(_value, !target) // toggle
        return { selected }
      }, () => {
        cb?.()
      })
    }

    return {
      data: this.state.tableData[0].data[index],
      index,
    }
  }

  onPressRow = item => {
    if (item.data instanceof Array) {
      // 多属性选中变颜色
      this.setState(state => {
        // copy the map rather than modifying state.
        const selected = new Map(state.selected)

        let data = item.data[0]
        if (
          data.name === getLanguage(global.language).Map_Attribute.ATTRIBUTE_NO
        ) {
          data = item.data[1]
        }
        const target = selected.get(data.value)
        if (!this.props.multiSelect && !target) {
          // 多选或者点击已选行
          selected.clear()
        }

        selected.set(data.value, !target) // toggle
        return { selected }
      })
    } else {
      if (
        this.props.onPressHeader &&
        typeof this.props.onPressHeader === 'function'
      ) {
        // this.props.onPressHeader({fieldInfo:item.data.fieldInfo,index:item.index,pressView:item.iTemView})
        this.props.onPressHeader({
          fieldInfo: item.data.fieldInfo,
          index: item.columnIndex,
          pressView: item.pressView,
        })
      }
    }

    if (this.props.selectRow && typeof this.props.selectRow === 'function') {
      this.props.selectRow(item)
    }
  }
  onPressHeader = item => {
    if (
      this.props.onPressHeader &&
      typeof this.props.onPressHeader === 'function' &&
      item.columnIndex !== 0 &&
      item.data &&
      item.data[0] !== getLanguage(global.language).Map_Label.NAME
    ) {
      this.props.onPressHeader({
        fieldInfo: item.data[item.columnIndex].fieldInfo,
        index: item.columnIndex,
        pressView: item.pressView,
      })
    }
  }

  onChangeEnd = data => {
    if (
      this.props.changeAction &&
      typeof this.props.changeAction === 'function'
    ) {
      this.props.changeAction(data)
      // 修改之后 刷新上一页数据
      global.NEEDREFRESHTABLE = true
    }
  }

  _renderSingleDataItem = ({ item, index }) => {
    return (
      <Row
        data={item}
        index={index}
        onPress={this.onPressRow}
        onChangeEnd={this.onChangeEnd}
        isShowSystemFields={this.props.isShowSystemFields}
        dismissTitles={this.props.dismissTitles}
      />
    )
  }

  _renderItem = ({ item, index }) => {
    let indexCellStyle = styles.cell,
      indexCellTextStyle = styles.cellText
    if (item instanceof Array && this.props.indexColumn >= 0) {
      indexCellStyle = styles.indexCell
      indexCellTextStyle = styles.indexCellText
    }
    let data = JSON.parse(JSON.stringify(item))
    if (
      this.props.startIndex >= 0 &&
      data && data.length > 0 &&
      data[0].name !== getLanguage(global.language).Map_Attribute.ATTRIBUTE_NO
    ) {
      data.unshift({
        name: getLanguage(global.language).Map_Attribute.ATTRIBUTE_NO,
        value: this.props.startIndex + index,
        fieldInfo: {},
      })
    }

    let buttonActions = [],
      buttonIndexes = [],
      buttonTitles = []

    if (this.props.type === 'MULTI_DATA') {
      buttonTitles = this.props.buttonTitles
      buttonIndexes = this.buttonIndexes
      // if (
      //   this.props.buttonNameFilter &&
      //   this.props.buttonNameFilter instanceof Array
      // ) {
      //   for (let index1 in item) {
      //     for (let filter of this.props.buttonNameFilter) {
      //       if (item[index1].name === filter) {
      //         buttonIndexes.push(parseInt(index1) + 1)
      //         break
      //       }
      //     }
      //   }
      // }
      this.props.buttonActions &&
        this.props.buttonActions instanceof Array &&
        this.props.buttonActions.forEach(action => {
          buttonActions.push(row => {
            if (typeof action === 'function') {
              if (item && item instanceof Array) {
                action({
                  rowData: row.data,
                  rowIndex: index,
                  cellData: row.data[row.columnIndex],
                  cellIndex: row.columnIndex,
                })
              } else {
                action({
                  rowData: this.props.data,
                  rowIndex: 0,
                  cellData: item,
                  cellIndex: index,
                })
              }
            }
          })
        })
    } else {
      if (
        this.props.buttonNameFilter &&
        this.props.buttonNameFilter instanceof Array
      ) {
        buttonTitles = this.props.buttonTitles || []
        for (let filterIndex in this.props.buttonNameFilter) {
          if (item.name === this.props.buttonNameFilter[filterIndex]) {
            if (this.props.buttonTitles.length > 0 && this.props.buttonTitles.length - 1 < filterIndex) {
              buttonTitles = [this.props.buttonTitles[this.props.buttonTitles.length - 1]]
            } else {
              buttonTitles = [this.props.buttonTitles[filterIndex]] || []
            }
            buttonIndexes = [1]

            if (this.props.buttonActions.length > 0 && this.props.buttonActions.length - 1 < filterIndex) {
              buttonActions = [this.props.buttonActions[this.props.buttonActions.length - 1]]
            } else {
              const action = this.props.buttonActions[filterIndex]
              if (typeof action === 'function') {
                buttonActions.push(row => {
                  if (item && item instanceof Array) {
                    action({
                      rowData: item,
                      rowIndex: index,
                      cellData: row.data,
                      cellIndex: row.index,
                    })
                  } else {
                    action({
                      rowData: this.props.data,
                      rowIndex: 0,
                      cellData: item,
                      cellIndex: index,
                    })
                  }
                })
              }
              // buttonActions = [this.props.buttonActions[filterIndex]] || []
            }

            // this.props.buttonActions &&
            //   this.props.buttonActions instanceof Array &&
            //   this.props.buttonActions.forEach(action => {
            //     buttonActions.push(row => {
            //       if (typeof action === 'function') {
            //         if (item && item instanceof Array) {
            //           action({
            //             rowData: item,
            //             rowIndex: index,
            //             cellData: row.data,
            //             cellIndex: row.index,
            //           })
            //         } else {
            //           action({
            //             rowData: this.props.data,
            //             rowIndex: 0,
            //             cellData: item,
            //             cellIndex: index,
            //           })
            //         }
            //       }
            //     })
            //   })
            break
          }
        }
      }
    }

    return (
      <Row
        data={data}
        selected={item[0] ? !!this.state.selected.get(item[0].value) : false}
        index={index}
        disableCellStyle={styles.disableCellStyle}
        // cellStyle={{ borderLeftWidth: scaleSize(2) }}
        indexColumn={this.props.indexColumn}
        indexCellStyle={[indexCellStyle, this.props.indexCellStyle]}
        indexCellTextStyle={[indexCellTextStyle, this.props.indexCellTextStyle]}
        // onPress={() => this.onPressRow({ data: item, index })}
        onPress={this.onPressRow}
        onFocus={evt => {
          this.itemClickPosition = evt.nativeEvent.pageY
          this.scrollIndex = index
        }}
        onChangeEnd={this.onChangeEnd}
        buttonIndexes={buttonIndexes}
        buttonActions={buttonActions}
        dismissIndexes={this.dismissIndexes}
        buttonTitles={buttonTitles}
        isShowSystemFields={this.props.isShowSystemFields}
      />
    )
  }

  _keyExtractor = (item, index) => {
    if (index === null) {
      return null
    }
    return index.toString()
  }

  _renderSectionHeader = ({ section }) => {
    let titles = [...section.title]
    // console.warn("titles: " + JSON.stringify(titles))
    if (
      this.props.startIndex >= 0 &&
      titles && titles.length > 0 &&
      titles[0].value !==
        getLanguage(global.language).Map_Attribute.ATTRIBUTE_NO
    ) {
      titles.unshift({
        isSystemField: false,
        value: getLanguage(global.language).Map_Attribute.ATTRIBUTE_NO,
      })
    }
    return (
      <Row
        style={{
          backgroundColor: color.itemColorGray2, // color.gray7,
          borderTopRightRadius: Platform.OS === 'ios' ? 0 : scaleSize(12),
          borderTopLeftRadius: Platform.OS === 'ios' ? 0 : scaleSize(12),
          borderWidth: 0,
        }}
        cellStyle={{
          borderLeftWidth: 0,
          // borderBottomWidth: 0,
        }}
        cellTextStyle={{ color: '#3C3C3C' }}
        data={titles}
        hasInputText={false}
        onPress={this.onPressHeader}
        isShowSystemFields={this.props.isShowSystemFields}
        dismissIndexes={this.dismissIndexes}
      />
    )
  }

  _onViewableItemsChanged = changed => {
    if (
      this.props.onViewableItemsChanged &&
      typeof this.props.onViewableItemsChanged === 'function'
    ) {
      this.props.onViewableItemsChanged(changed)
    }
  }

  getItemLayout = (data, index) => {
    return {
      length: scaleSize(80),
      offset: scaleSize(80) * index,
      index,
    }
  }

  renderMultiDataTable = () => {
    return (
      <ScrollView
        ref={ref => (this.horizontalTable = ref)}
        style={[{ flex: 1 }, this.props.contentContainerStyle]}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[{paddingHorizontal: scaleSize(40)}, this.props.contentContainerStyle]}
      >
        <SectionList
          ref={ref => (this.table = ref)}
          refreshing={this.state.refreshing}
          style={styles.listContainer}
          sections={this.state.tableData}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          renderSectionHeader={this._renderSectionHeader}
          onRefresh={this.refresh}
          onEndReachedThreshold={1}
          onEndReached={this.loadMore}
          initialNumToRender={20}
          getItemLayout={this.getItemLayout}
          extraData={this.state}
          stickySectionHeadersEnabled={this.props.stickySectionHeadersEnabled}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          renderSectionFooter={this.renderFooter}
          onScroll={() => (this.canBeLoadMore = true)}
          // removeClippedSubviews={true} // ios使用后，底部有一行被透明行覆盖，无法选中
          onViewableItemsChanged={this._onViewableItemsChanged}
        />
      </ScrollView>
    )
  }

  renderSingleDataTable = () => {
    let tableData = []
    if (this.dismissIndexes.length > 0) {
      this.dismissIndexes.sort((a, b) => a - b)
      tableData = JSON.parse(JSON.stringify(this.state.tableData))
      for (let i = this.dismissIndexes.length - 1; i >= 0; i--) {
        tableData[0].data.splice(this.dismissIndexes[i], 1)
      }
    } else {
      tableData = this.state.tableData
    }
    return (
      <SectionList
        ref={ref => (this.table = ref)}
        refreshing={this.state.refreshing}
        style={[styles.listContainer, {marginHorizontal: scaleSize(40)}]}
        sections={tableData}
        // renderItem={this._renderSingleDataItem}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
        renderSectionHeader={this._renderSectionHeader}
        onRefresh={this.refresh}
        // onEndReachedThreshold={0.5}
        // onEndReached={this.loadMore}
        extraData={this.state}
        initialNumToRender={20}
        getItemLayout={this.getItemLayout}
        stickySectionHeadersEnabled={this.props.stickySectionHeadersEnabled}
      />
    )
  }

  renderFooter = () => {
    if (!this.state.loading) return <View />
    return (
      <View
        style={{
          flex: 1,
          height: COL_HEIGHT,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <IndicatorLoading
          title={getLanguage(global.language).Prompt.LOADING}
        />
      </View>
    )
  }

  render() {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' && "padding"}
        enabled
        style={[styles.container, this.props.contentContainerStyle]}
        keyboardVerticalOffset={this.props.keyboardVerticalOffset}
      >
        {this.props.type === 'MULTI_DATA'
          ? this.renderMultiDataTable()
          : this.renderSingleDataTable()}
      </KeyboardAvoidingView>
    )
  }
}

LayerAttributeTable.Type = {
  ATTRIBUTE: 'ATTRIBUTE',
  EDIT_ATTRIBUTE: 'EDIT_ATTRIBUTE',
  SINGLE_DATA: 'SINGLE_DATA', // 单个对象的属性，两列：'名称', '属性值'
  MULTI_DATA: 'MULTI_DATA', // 多个对象的属性，多列
}

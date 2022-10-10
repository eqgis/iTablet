import { ARElementType, SARMap, TARElementType } from 'imobile_for_reactnative'
import * as React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { connect, ConnectedProps } from 'react-redux'
import { getLanguage } from '../../../../language'
import { RootState } from '../../../../redux/types'
import { AppLog, AppStyle, AppToolBar, AttributeUtils, dp, Toast, dataUtil as DataUtil, scaleSize } from '../../../../utils'
import { Attributes, AttributesResp } from '../../../../utils/AttributeUtils'
// import { Container } from '../../../../component'
// import { MainStackScreenNavigationProp, MainStackScreenRouteProp } from '../../../../page/types'
import LayerAttributeTable from './LayerAttribute/components/LayerAttributeTable'
import LayerTopBar from './LayerAttribute/components/LayerTopBar'
import LayerAttributeAdd from './LayerAttribute/pages/layerAttributeAdd'
import AttributeDetail, { SandTableData } from './LayerAttribute/pages/AttributeDetail'
import { AddResult } from './LayerAttribute/pages/layerAttributeAdd/LayerAttributeAdd'
import { getImage } from '../../../../assets'
import { ButtonActionParams } from './LayerAttribute/components/LayerAttributeTable/LayerAttributeTable'
import { checkSupportARAttributeByElement, checkSupportARAttributeByLayer } from '../Actions'

const PAGE_SIZE = 30
const ROWS_LIMIT = 120
const COL_HEIGHT = scaleSize(80)

type GetMethod = 'reset' | 'refresh' | 'loadMore'

type Props = ReduxProps

interface State {
  attributes: Attributes,
  showTable: boolean,
  currentFieldInfo: any[],
  currentIndex: number,
  startIndex: number,
  relativeIndex: number,
  isShowSystemFields: boolean,
  addToScene: boolean,
}

class Attribute extends React.Component<Props, State> {

  currentPage = 0
  total = 0 // 属性总数
  canBeRefresh = true // 是否可以刷新
  noMore = false // 是否可以加载更多
  isLoading = false // 防止同时重复加载多次
  filter = '' // 属性查询过滤
  isMediaLayer = false // 是否是多媒体图层
  layerName = ''
  addPopModal: LayerAttributeAdd | null | undefined
  table: LayerAttributeTable | null | undefined
  detailPopModal: AttributeDetail | null | undefined
  selectedAttributeList: string[]

  constructor(props: Props) {
    super(props)
    // const params = this.props.route.params
    // let checkData = this.checkToolIsViable()
    this.state = {
      attributes: {
        head: [],
        data: [],
      },
      showTable: false,
      currentFieldInfo: [],
      relativeIndex: -1, // 当前页面从startIndex开始的被选中的index, 0 -> this.total - 1
      currentIndex: -1,
      startIndex: 0,

      // canBeUndo: checkData.canBeUndo,
      // canBeRedo: checkData.canBeRedo,
      // canBeRevert: checkData.canBeRevert,

      isShowSystemFields: true,
      addToScene: false,
    }

    this.currentPage = 0
    this.total = 0 // 属性总数
    this.canBeRefresh = true // 是否可以刷新
    this.noMore = false // 是否可以加载更多
    this.isLoading = false // 防止同时重复加载多次
    this.filter = '' // 属性查询过滤
    this.isMediaLayer = false // 是否是多媒体图层
    this.selectedAttributeList = [] // 被选择的属性名称

    const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
    const selectARElement = AppToolBar.getData().selectARElement
    if(selectARElement?.layerName) {
      this.layerName = selectARElement.layerName
    } else if (layer) {
      this.layerName = layer.name
    }
  }

  // componentDidUpdate(prevProps: Props) {
  //   if(prevProps.visible !== this.props.visible && this.props.visible) {
  //     this.onVisible()
  //   }
  // }

  componentDidMount() {
    this.refresh()
  }

  /** 下拉刷新 **/
  refresh = (cb?: () => void, resetCurrent = false) => {
    if (!this.canBeRefresh || !this.layerName) {
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
    const currentPage = startIndex / PAGE_SIZE
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
  loadMore = (cb?: () => void) => {
    if (this.isLoading || !this.layerName) return
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
          Toast.show('加载完毕')
          // this.currentPage--
        }
      },
    )
  }

  getAttribute = async (params: {
    type: GetMethod,
    currentPage: number,
    startIndex?: number,
    currentIndex?: number,
    pageSize?: number,
  }, cb?: ((data?: any) => void) | null | undefined, resetCurrent = false) => {
    const { currentPage, pageSize, type } = params
    const selectARElement = AppToolBar.getData().selectARElement
    const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
    let result: AttributesResp | undefined

    let attributes: Attributes = resetCurrent ? {
      head: [],
      data: [],
    } : JSON.parse(JSON.stringify(this.state.attributes))
    if(selectARElement?.layerName) {
      this.layerName = selectARElement.layerName
      result = await AttributeUtils.getSelectionAttributeByData(attributes, selectARElement.layerName, 0, pageSize !== undefined ? pageSize : PAGE_SIZE, type)
    } else if (layer) {
      this.layerName = layer.name
      result = await AttributeUtils.getLayerAttribute(attributes, layer.name, currentPage, pageSize !== undefined ? pageSize : PAGE_SIZE, {}, type)
    }

    if (!result) {
      this.isLoading = false
      return
    }

    this.total = result?.total || 0
    attributes = result.attributes || []

    if (this.total === 1 && attributes.data.length === 1) {
      this.setState({
        showTable: true,
        attributes,
        currentIndex: 0,
        relativeIndex: 0,
        currentFieldInfo: attributes.data[0],
        startIndex: 0,
        // ...checkData,
        // ...others,
      })
      // this.setLoading(false)
      cb && cb(attributes)
    } else {
      const newAttributes = JSON.parse(JSON.stringify(attributes))
      let startIndex =
      params.startIndex !== undefined && params.startIndex >= 0
        ? params.startIndex
        : this.state.startIndex || 0
      // 截取数据，最多显示 ROWS_LIMIT 行
      if (attributes.data.length > ROWS_LIMIT) {
        if (type === 'refresh' || type === 'reset') {
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

      const currentIndex = resetCurrent
        ? -1
        : params.currentIndex !== undefined
          ? params.currentIndex
          : this.state.currentIndex
      const relativeIndex =
        resetCurrent || currentIndex < 0 ? -1 : currentIndex - startIndex
      // : currentIndex - startIndex - 1
      const prevStartIndex = this.state.startIndex
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
          // ...checkData,
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
                  itemIndex: newAttributes.data.length - (result?.resLength || 0),
                  sectionIndex: 0,
                  viewPosition: 1,
                })
            }
            // this.setLoading(false)
            cb && cb(attributes)
          }, 0)
        },
      )
    }
  }

  changeAction = async (data: any) => {
    try {
      // 单个对象属性和多个对象属性数据有区别
      const isSingleData = this.state.attributes.data.length === 1
      // 单个对象属性 在 隐藏系统字段下，要重新计算index
      if (isSingleData && !this.state.isShowSystemFields) {
        for (const index in this.state.attributes.data[0]) {
          if (this.state.attributes.data[0][index].name === data.rowData.name) {
            data.index = index
          }
        }
      }
      await SARMap.setDataFieldInfo(
        this.layerName,
        [
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
        {
          filter: `SmID=${isSingleData
            ? this.state.attributes.data[0][0].value
            : data.rowData[1].value // 0为序号
          }`, // 过滤条件
          cursorType: 2, // 2: DYNAMIC, 3: STATIC
        },
      )
    } catch (error) {
      AppLog.error(error)
    }
  }

  onChecked = (selected: string[]) => {
    this.selectedAttributeList = selected
    // if(this.state.addToScene) {
    //   AppToolBar.addData({
    //     selectedAttribute: this.state.addToScene ? this.selectedAttributeList : [],
    //   })
    // }
    this.addToScene(selected.length > 0)
  }

  deleteAction = () => {}

  addFieldAction = () => {
    this.addPopModal && this.addPopModal.setVisible(true)
  }

  showSystemFields = () => {
    this.setState({
      isShowSystemFields: !this.state.isShowSystemFields,
    })
  }

  /** 添加属性字段 **/
  addAttributeField = async (fieldInfo: AddResult) => {
    const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
    const selectARElement = AppToolBar.getData().selectARElement
    let layerName
    if (selectARElement?.layerName) {
      layerName = selectARElement?.layerName
    } else {
      layerName = layer?.name
    }
    if (!layerName) return false
    const checkName = DataUtil.isLegalName(fieldInfo.name)
    if (!checkName.result) {
      Toast.show(getLanguage().NAME + checkName.error)
      return false
    }
    const checkCaption = DataUtil.isLegalName(fieldInfo.caption)
    if (!checkCaption.result) {
      Toast.show(getLanguage().ALIAS + checkCaption.error)
      return false
    }
    const result = await SARMap.addAttributeFieldInfo(layerName, fieldInfo)
    if (result) {
      Toast.show(getLanguage().ATTRIBUTE_ADD_SUCCESS)
      this.refresh(undefined, true)
    } else {
      Toast.show(getLanguage().ATTRIBUTE_ADD_FAILED)
    }
    return result
  }

  /** 是否添加到场景中 */
  addToScene = (addToScene?: boolean) => {
    if (addToScene === undefined) {
      addToScene = !this.state.addToScene
    }
    if (addToScene !== this.state.addToScene) {
      this.setState({
        addToScene: addToScene,
      })
    }

    AppToolBar.addData({
      selectedAttribute: addToScene ? this.selectedAttributeList : [],
    })
  }

  modifyModelInfo = (modelID: number, data: SandTableData) => {
    try {
      SARMap.setARSandTableData(this.layerName, modelID, JSON.stringify(data))
    } catch (error) {
      // eslint-disable-next-line no-console
      __DEV__ && console.warn(error)
    }
  }

  renderTopBar = () => {
    return (
      <LayerTopBar
        hasAddField={true}
        isShowSystemFields={this.state.isShowSystemFields}
        canDelete={this.state.currentIndex >= 0}
        canAddField={true}
        deleteAction={this.deleteAction}
        addFieldAction={this.addFieldAction}
        showSystemFields={this.showSystemFields}
      />
    )
  }

  renderMapLayerAttribute = () => {
    const buttonNameFilter = ['AR_MODEL_INFO'], // 属性表cell显示 查看 按钮
      buttonTitles = [getLanguage().VIEW]
    // const buttonNameFilter: string[] = [], // 属性表cell显示 查看 按钮
    //   buttonTitles: string[] = []
    const buttonActions: ((data: ButtonActionParams) => void)[] | undefined = [
      async data => {
        let modelID = -1
        let elementType: TARElementType | null = null
        for (const key in data.rowData) {
          if (Object.prototype.hasOwnProperty.call(data.rowData, key)) {
            const element = data.rowData[key]
            if (element.name.toLowerCase() === 'smid') {
              modelID = element.value
            } else if(element.name.toLowerCase() === 'ar_eletype') {
              elementType = element.value as TARElementType
            }
          }
        }
        if (modelID >= 0 && elementType === ARElementType.AR_SAND_TABLE) {
          const modalData = await SARMap.getARSandTableData(this.layerName, modelID)
          let data = undefined
          try {
            data = JSON.parse(modalData)
          } catch (e) {/** */}
          this.detailPopModal?.setVisible(true, modelID, data)
        } else {
          Toast.show(getLanguage().NULL_DATA)
        }
      },
    ]
    const dismissTitles = ['AR_ATTRIBUTE_STYLE', 'AR_MODEL_INFO']
    const isSingle = this.total === 1 && this.state.attributes.data.length === 1
    let isSupport = false
    const selectElement = AppToolBar.getData().selectARElement
    const currentLayer = AppToolBar.getProps().arMapInfo?.currentLayer
    if(selectElement?.layerName) {
      isSupport = checkSupportARAttributeByElement(selectElement.type)
    } else if(currentLayer) {
      isSupport = checkSupportARAttributeByLayer(currentLayer.type)
    }
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
              getLanguage().NAME,
              getLanguage().ATTRIBUTE,
            ]
            : this.state.attributes.head
        }
        widthArr={isSingle ? [100, 100] : undefined}
        type={
          isSingle
            ? LayerAttributeTable.Type.SINGLE_DATA
            : LayerAttributeTable.Type.MULTI_DATA
        }
        indexColumn={0}
        hasIndex={this.state.attributes.data.length > 1}
        startIndex={
          isSingle
            ? -1
            : this.state.startIndex + 1
        }
        contentContainerStyle={{ backgroundColor: AppStyle.Color.WHITE, marginTop: dp(5) }}
        refresh={cb => this.refresh(cb)}
        loadMore={cb => this.loadMore(cb)}
        changeAction={this.changeAction}
        checkable={isSupport}
        onChecked={this.onChecked}
        buttonNameFilter={buttonNameFilter}
        buttonActions={buttonActions}
        dismissTitles={dismissTitles}
        buttonTitles={buttonTitles}
        isShowSystemFields={this.state.isShowSystemFields}
      />
    )
  }

  renderAdd = () => {
    return (
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
        // navigation={this.props.navigation}
        device={this.props.device}
        // currentAttribute={this.props.currentAttribute}
        // setCurrentAttribute={this.props.setCurrentAttribute}
        data={this.state.attributes.head[this.state.attributes.head.length - 1]}
        addAttributeField={this.addAttributeField}
        backAction={() => {
          this.addPopModal && this.addPopModal.setVisible(false)
        }}
      />
    )
  }

  renderDetail = () => {
    return (
      <AttributeDetail
        ref={ref => (this.detailPopModal = ref)}
        device={this.props.device}
        confirm={this.modifyModelInfo}
      />
    )
  }

  renderAddTable = () => {
    let isSupport = false
    const selectElement = AppToolBar.getData().selectARElement
    const currentLayer = AppToolBar.getProps().arMapInfo?.currentLayer
    if(selectElement?.layerName) {
      isSupport = checkSupportARAttributeByElement(selectElement.type)
    } else if(currentLayer) {
      isSupport = checkSupportARAttributeByLayer(currentLayer.type)
    }
    const icon = this.state.addToScene
      ? getImage().icon_check
      : getImage().icon_uncheck
    return isSupport ? (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          backgroundColor: 'transparent',
          alignItems: 'center',
          height: dp(40),
          paddingHorizontal: dp(20),
        }}
        onPress={() => this.addToScene()}
      >
        <Image
          style={AppStyle.Image_Style}
          source={icon}
        />
        <Text style={[AppStyle.h2, {marginLeft: dp(10)}]}>{getLanguage().ATTRIBUTE_ADD_TO_AR_SCENE}</Text>
      </TouchableOpacity>
    ) : null
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <View style={{flex: 1, marginBottom: dp(60), marginTop: dp(40)}}>
          {this.renderTopBar()}
          {this.renderMapLayerAttribute()}
          {this.renderAddTable()}
          {this.renderAdd()}
          {this.renderDetail()}
        </View>
      </View>
    )
  }
}

const mapStateToProp = (state: RootState) => ({
  device: state.device.toJS().device,
})

const mapDispatch = {

}

type ReduxProps = ConnectedProps<typeof connector>
const connector = connect(mapStateToProp, mapDispatch)

export default connector(Attribute)
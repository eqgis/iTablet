import React from 'react'
import { color } from '../../../../../styles'
import { Toast, scaleSize } from '../../../../../utils'
import {
  ConstPath,
  ConstOnline,
  UserType,
  ToolbarType,
  ConstToolType,
} from '../../../../../constants'
import { getLanguage } from '../../../../../language'
import ToolBarSectionList from './ToolBarSectionList'

import { FileTools } from '../../../../../native'
import NavigationService from '../../../../NavigationService'
import { SMap, SMediaCollector } from 'imobile_for_reactnative'
import ToolbarModule from '../modules/ToolbarModule'

export default class ToolList extends React.Component {
  props: {
    type: string,
    containerType: string,
    language: string,
    device: Object,
    user: Object,
    data: Array,
    setContainerLoading: () => {}, //多选刷新列表时调用
    saveMap: () => {},
    closeMap: () => {},
    openWorkspace: () => {},
    setCollectionInfo: () => {},
    setCurrentTemplateInfo: () => {},
    setCurrentPlotInfo: () => {},
    setTemplate: () => {},
    mapMoveToCurrent: () => {},
    getLayers: () => {},
    existFullMap: () => {},
    setCurrentLayer: () => {},
    setToolbarVisible: () => {},
    getMapSetting: () => {},
    getToolbarModule: () => {},
  }

  static defaultProps = {
    getToolbarModule: () => ToolbarModule,
  }

  constructor(props) {
    super(props)
    this.ToolbarModule = this.props.getToolbarModule()
    this.state = {
      data: this.props.data || [],
      // listExpressions: [],
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      JSON.stringify(nextProps) !== JSON.stringify(this.props) ||
      JSON.stringify(nextState) !== JSON.stringify(this.state)
    ) {
      return true
    }

    return false
  }

  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(this.props.data) !== JSON.stringify(prevProps.data) &&
      JSON.stringify(this.props.data) !== JSON.stringify(this.state.data)
    ) {
      this.setState({
        data: this.props.data,
      })
    }
  }

  /**点击item切换专题字段，刷新字段表达式列表 */
  refreshList = item => {
    let data
    if (this.ToolbarModule.getData().actions.refreshModels) {
      data = this.ToolbarModule.getData().actions.refreshModels(item)
      this.setState({
        data,
      })
    } else {
      data = JSON.parse(JSON.stringify(this.state.data[0].data))
      for (let index = 0; index < data.length; index++) {
        const element = data[index]
        if (element.expression === item) {
          element.isSelected = true
        } else {
          element.isSelected = false
        }
      }
      let datalist = [
        {
          title: this.state.data[0].title || this.state.data[0].datasetName,
          datasetType: this.state.data[0].datasetType,
          expressionType: true,
          data: data,
        },
      ]
      this.setState({
        data: datalist,
      })
    }
  }

  //滚动到顶部
  scrollListToLocation = () => {
    this.toolBarSectionList &&
      this.toolBarSectionList.scrollToLocation({
        sectionIndex: 0,
        itemIndex: 0,
        viewOffset: scaleSize(80),
        viewPosition: 0,
      })
  }

  //滚动到指定位置
  scrollListTo = (sectionIndex, itemIndex) => {
    this.toolBarSectionList &&
      this.toolBarSectionList.scrollToLocation({
        sectionIndex: sectionIndex,
        itemIndex: itemIndex,
        viewOffset: scaleSize(80),
      })
  }

  headerAction = ({ section }) => {
    (async function() {
      if (
        this.ToolbarModule.getData().actions &&
        this.ToolbarModule.getData().actions.headerAction
      ) {
        // this.ToolbarModule.getData().actions.listAction({ item, index, section })
        this.ToolbarModule.getData().actions.headerAction(
          this.props.type,
          section,
        )
        return
      }
      if (
        section.title ===
        getLanguage(this.props.language).Map_Main_Menu.CREATE_WITH_SYMBOLS
      ) {
        let userPath =
          this.props.user.currentUser.userName &&
          this.props.user.currentUser.userType !== UserType.PROBATION_USER
            ? ConstPath.UserPath + this.props.user.currentUser.userName + '/'
            : ConstPath.CustomerPath
        let mapPath = await FileTools.appendingHomeDirectory(
          userPath + ConstPath.RelativePath.Map,
        )
        let newName = await FileTools.getAvailableMapName(mapPath, 'DefaultMap')
        NavigationService.navigate('InputPage', {
          headerTitle: getLanguage(this.props.language).Map_Main_Menu
            .START_NEW_MAP,
          //'新建地图',
          value: newName,
          placeholder: getLanguage(this.props.language).Prompt.ENTER_MAP_NAME,
          type: 'name',
          cb: async value => {
            global.Loading &&
              global.Loading.setLoading(
                true,
                getLanguage(this.props.language).Prompt.CREATING,
                //ConstInfo.MAP_SYMBOL_COLLECTION_CREATING,
              )
            // 移除地图上所有callout
            SMediaCollector.removeMedias()
            await this.props.closeMap()
            this.props.setCollectionInfo() // 清空当前模板
            this.props.setCurrentTemplateInfo() // 清空当前模板
            this.props.setCurrentPlotInfo() //清空模板
            this.props.setTemplate() // 清空模板

            // 重新打开工作空间，防止Resource被删除或破坏
            const customerPath =
              ConstPath.CustomerPath +
              ConstPath.RelativeFilePath.Workspace[
                global.language === 'CN' ? 'CN' : 'EN'
              ]
            let wsPath
            if (this.props.user.currentUser.userName) {
              const userWSPath =
                ConstPath.UserPath +
                this.props.user.currentUser.userName +
                '/' +
                ConstPath.RelativeFilePath.Workspace[
                  global.language === 'CN' ? 'CN' : 'EN'
                ]
              wsPath = await FileTools.appendingHomeDirectory(userWSPath)
            } else {
              wsPath = await FileTools.appendingHomeDirectory(customerPath)
            }
            await this.props.openWorkspace({ server: wsPath })
            await SMap.openMapWithDatasource(
              ConstOnline['Google'].DSParams,
              // ConstOnline['Google'].layerIndex,
              1,
            )

            let layers = await this.props.getLayers()
            await SMap.openTaggingDataset(this.props.user.currentUser.userName)
            // 检查是否有可显示的标注图层，并把多媒体标注显示到地图上
            await SMap.getTaggingLayers(
              this.props.user.currentUser.userName,
            ).then(dataList => {
              dataList.forEach(item => {
                if (item.isVisible) {
                  SMediaCollector.showMedia(item.name)
                }
              })
            })
            // 隐藏底图
            await SMap.setLayerVisible(layers[layers.length - 1].path, true)

            this.props.mapMoveToCurrent()

            this.props.saveMap &&
              (await this.props.saveMap({
                mapName: value,
                nModule: global.Type,
                notSaveToXML: true,
              }))

            global.Loading && global.Loading.setLoading(false)
            NavigationService.goBack()
            setTimeout(async () => {
              this.props.setToolbarVisible(false)
              if (global.legend) {
                await SMap.addLegendListener({
                  legendContentChange: global.legend._contentChange,
                })
              }
              Toast.show(
                getLanguage(this.props.language).Prompt.CREATE_SUCCESSFULLY,
              )
            }, 1000)
          },
        })
      }
    }.bind(this)())
  }

  listAction = ({ item, index, section, ...params }) => {
    if (this.props.type === ConstToolType.SM_MAP3D_BASE) return
    if (
      this.ToolbarModule.getData().actions &&
      this.ToolbarModule.getData().actions.listAction
    ) {
      // this.ToolbarModule.getData().actions.listAction({ item, index, section })
      params.refreshList = this.refreshList
      this.ToolbarModule.getData().actions.listAction(this.props.type, {
        item,
        index,
        section,
        ...params,
      })
      return
    }
    if (item.action) {
      if(this.props.type === ConstToolType.SM_MAP_LAYER_BASE_CHANGE){
        item.action && item.action({type:'tiandt'})
      }else{
        item.action && item.action()
      }
    }
  }

  render() {
    return (
      <ToolBarSectionList
        style={{ flex: 1, backgroundColor: color.white, paddingTop: scaleSize(20) }}
        ref={ref => (this.toolBarSectionList = ref)}
        listSelectable={this.props.containerType === ToolbarType.selectableList}
        sections={this.state.data}
        itemAction={({ item, index, section, ...params }) => {
          this.listAction({ item, index, section, ...params })
        }}
        listSelectableAction={({ selectList }) => {
          if (
            this.ToolbarModule.getData().actions &&
            this.ToolbarModule.getData().actions.listSelectableAction
          ) {
            this.ToolbarModule.getData().actions.listSelectableAction({
              selectList,
            })
          }
        }}
        headerAction={this.headerAction}
        underlayColor={color.item_separate_white}
        keyExtractor={(item, index) => index}
        device={this.props.device}
        getToolbarModule={this.props.getToolbarModule}
      />
    )
  }
}

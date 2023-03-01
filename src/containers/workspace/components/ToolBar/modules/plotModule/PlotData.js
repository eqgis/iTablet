import React from 'react'
import { TouchableOpacity, Image } from 'react-native'
import { SMap, SPlot } from 'imobile_for_reactnative'
import constants from '../../../../constants'
import { ConstToolType, ConstPath } from '../../../../../../constants'
import ToolbarBtnType from '../../ToolbarBtnType'
import { getLanguage } from '../../../../../../language'
import { Toast, scaleSize } from '../../../../../../utils'
import { FileTools } from '../../../../../../native'
import { getThemeAssets } from '../../../../../../assets'
import ToolbarModule from '../ToolbarModule'
import PlotAction from './PlotAction'

function getData(type, params) {
  let tabBarData = {}
  if (
    type === ConstToolType.SM_MAP_PLOT_ANIMATION_START ||
    type === ConstToolType.SM_MAP_PLOT_ANIMATION_NODE_CREATE ||
    type === ConstToolType.SM_MAP_PLOT_ANIMATION_PLAY ||
    type === ConstToolType.SM_MAP_PLOT_ANIMATION_GO_OBJECT_LIST
    // ||type === ConstToolType.SM_MAP_PLOT_ANIMATION_XML_LIST
  ) {
    tabBarData = getPlotOperationData(type, params)
  } else if (type === ConstToolType.SM_MAP_PLOT_ANIMATION_WAY) {
    tabBarData = getAnimationWayData(type, params)
  }
  return tabBarData
}

function getPlotButtons() {
  let buttons = [
    // ToolbarBtnType.END_ANIMATION,
    ToolbarBtnType.CANCEL,
    // ToolbarBtnType.PLOT_ANIMATION_XML_LIST,
    {
      type: ToolbarBtnType.SHOW_LIST,
      image: getThemeAssets().toolbar.icon_list,
      action: PlotAction.showAnimationXmlList,
    },
    // ToolbarBtnType.PLOT_ANIMATION_PLAY,
    {
      type: ToolbarBtnType.PLAY,
      image: getThemeAssets().mapTools.icon_tool_play,
      action: PlotAction.animationPlay,
    },
    // ToolbarBtnType.PLOT_ANIMATION_GO_OBJECT_LIST,
    {
      type: ToolbarBtnType.SHOW_NODE_LIST,
      // image: require('../../../../../../assets/mapEdit/icon_function_theme_param_menu.png'),
      image: getThemeAssets().toolbar.icon_toolbar_option,
      action: PlotAction.showAnimationNodeList,
    },
    {
      type: ToolbarBtnType.SAVE,
      // image: require('../../../../../../assets/mapTools/icon_save.png'),
      image: getThemeAssets().start.icon_save,
      action: PlotAction.animationSave,
    },
  ]
  return buttons
}

/**
 * 获取标绘操作数据
 */
function getPlotOperationData(type, params) {
  ToolbarModule.setParams(params)
  let data = []
  let buttons = getPlotButtons()
  switch (type) {
    case ConstToolType.SM_MAP_PLOT_ANIMATION_START:
      data = []
      break
    case ConstToolType.SM_MAP_PLOT_ANIMATION_NODE_CREATE:
      data = []
      buttons = [ToolbarBtnType.CANCEL]
      break
    case ConstToolType.SM_MAP_PLOT_ANIMATION_XML_LIST:
      data = []
      break
    case ConstToolType.SM_MAP_PLOT_ANIMATION_GO_OBJECT_LIST:
      data = getAnimationNodeListData()
      break
    case ConstToolType.SM_MAP_PLOT_ANIMATION_PLAY:
      data = [
        {
          key: 'startFly',
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_START,
          // '开始播放',
          action: async () => {
            await SPlot.initAnimation()
            await SPlot.animationPlay()
          },
          size: 'large',
          image: require('../../../../../../assets/mapEdit/icon_play.png'),
          selectedImage: require('../../../../../../assets/mapEdit/icon_play.png'),
        },
        {
          key: 'stop',
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_PAUSE,
          // '暂停',
          action: () => {
            SPlot.animationPause()
          },
          size: 'large',
          image: require('../../../../../../assets/mapEdit/icon_stop.png'),
          selectedImage: require('../../../../../../assets/mapEdit/icon_stop.png'),
          // selectMode:"flash"
        },
        {
          key: 'reset',
          title: getLanguage(global.language).Map_Main_Menu
            .PLOTTING_ANIMATION_RESET,
          // '复原',
          action: () => PlotAction.reset(),
          size: 'large',
          image: getThemeAssets().mapTools.icon_tool_cancel,
          selectedImage: getThemeAssets().mapTools.icon_tool_cancel,
          // selectMode:"flash"
        },
      ]
  }

  return { data, buttons }
}

function getAnimationNodeListData() {
  const animationNodeList = []
  const data = [
    {
      title: getLanguage(global.language).Map_Plotting.ANIMATION_NODE_EDIT,
      // '态势推演列表',
      data: animationNodeList,
    },
  ]
  return data
}

/**
 * 获取创建路径按钮数据
 */
function getAnimationWayData(type, params) {
  ToolbarModule.setParams(params)
  const data = []
  let buttons = []
  switch (type) {
    case ConstToolType.SM_MAP_PLOT_ANIMATION_WAY:
      data.push({
        key: constants.CANCEL,
        title: getLanguage(global.language).Map_Plotting
          .PLOTTING_ANIMATION_BACK,
        action: PlotAction.cancelAnimationWay,
        size: 'large',
        image: getThemeAssets().publicAssets.icon_cancel,
      })
      data.push({
        key: constants.UNDO,
        title: getLanguage(global.language).Map_Main_Menu.COLLECTION_UNDO,
        action: PlotAction.animationWayUndo,
        size: 'large',
        image: getThemeAssets().edit.icon_undo,
      })
      data.push({
        key: constants.SUBMIT,
        title: getLanguage(global.language).Map_Plotting
          .PLOTTING_ANIMATION_SAVE,
        action: PlotAction.endAnimationWayPoint,
        size: 'large',
        image: getThemeAssets().publicAssets.icon_submit,
      })
      break
  }

  buttons = [ToolbarBtnType.END_ANIMATION]

  return { data, buttons }
}

/**
 * 获取采集操作数据
 * @param type
 * @returns {*}
 */
function getCollectionData(libId, symbolCode, params) {
  ToolbarModule.setParams(params)
  const data = []
  let buttons = []
  data.push({
    key: constants.UNDO,
    title: getLanguage(global.language).Map_Main_Menu.COLLECTION_UNDO,
    // constants.UNDO,
    action: PlotAction.undo,
    size: 'large',
    image: getThemeAssets().edit.icon_undo,
  })
  data.push({
    key: constants.REDO,
    title: getLanguage(global.language).Map_Main_Menu.COLLECTION_REDO,
    // constants.REDO,
    action: PlotAction.redo,
    size: 'large',
    image: getThemeAssets().edit.icon_redo,
  })

  data.push({
    key: constants.CANCEL,
    title: getLanguage(global.language).Map_Main_Menu.COLLECTION_CANCEL,
    // constants.CANCEL,
    action: () => PlotAction.cancel(libId, symbolCode),
    size: 'large',
    image: getThemeAssets().publicAssets.icon_cancel,
  })
  data.push({
    key: constants.SUBMIT,
    title: getLanguage(global.language).Map_Main_Menu.COLLECTION_SUBMIT,
    // constants.SUBMIT,
    action: () => PlotAction.collectionSubmit(libId, symbolCode),
    size: 'large',
    image: getThemeAssets().publicAssets.icon_submit,
  })
  buttons = [
    ToolbarBtnType.CANCEL,
    // ToolbarBtnType.CHANGE_COLLECTION,
    {
      type: ToolbarBtnType.MAP_SYMBOL,
      image: getThemeAssets().collection.icon_symbol,
      action: PlotAction.showSymbol,
    },
    ToolbarBtnType.COMPLETE,
  ]

  return { data, buttons }
}

/**
 * 删除态势推演动画文件
 * @param {*} item
 */
async function deleteAnimation(item) {
  global.SimpleDialog.set({
    text: getLanguage(global.language).Prompt.DELETE_PLOTTING_DEDUCTION,
    cancelText: getLanguage(global.language).Prompt.CANCEL,
    cancelAction: /*AppUtils.AppExit*/ async () =>{
      global.Loading.setLoading(false)
    },
    confirmText: getLanguage(global.language).Prompt.DELETE,
    confirmAction: async () => {
      try {
        if (await FileTools.fileIsExist(item.path)) {
          await FileTools.deleteFile(item.path)
          await SPlot.readAnimationXmlFile(item.path)
          await PlotAction.showAnimationXmlList()
        } else {
          Toast.show(getLanguage(global.language).Friends.RESOURCE_NOT_EXIST)
        }
        await getAnimationList()
      } catch (error) {
        Toast.show(getLanguage(global.language).Prompt.FAILED_TO_DELETE)
      }
    },
  })
  global.SimpleDialog.setVisible(true)
}

async function getAnimationList() {
  const params = ToolbarModule.getParams()
  let buttons = getPlotButtons()
  try {
    const mapName = await SMap.getMapName()

    const userName = params.user.currentUser.userName || 'Customer'
    const path = await FileTools.appendingHomeDirectory(
      `${ConstPath.UserPath + userName}/${
        ConstPath.RelativeFilePath.Animation
      }${mapName}/`,
    )
    const animationXmlList = []
    const arrDirContent = await FileTools.getDirectoryContent(path)
    if (arrDirContent.length > 0) {
      let i = 0
      for (const key in arrDirContent) {
        if (arrDirContent[key].type === 'file') {
          const item = {}
          item.title = arrDirContent[key].name.split('.')[0]
          item.index = i
          item.path = path + arrDirContent[key].name
          item.rightView = (
            <TouchableOpacity
              style={{
                height: scaleSize(60),
                width: scaleSize(60),
                marginRight: scaleSize(40),
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => deleteAnimation(item)}
            >
              <Image
                source={getThemeAssets().edit.icon_delete}
                style={{
                  height: scaleSize(40),
                  width: scaleSize(40),
                }}
              />
            </TouchableOpacity>
          )
          animationXmlList.push(item)
          i++
        }
      }
    }

    if (animationXmlList.length === 0) {
      Toast.show(
        getLanguage(params.language).Prompt.NO_PLOTTING_DEDUCTION,
        // '当前场景无态势推演'
      )
    } else {
      SPlot.initAnimation()
    }

    const data = [
      {
        title: getLanguage(params.language).Map_Main_Menu
          .PLOTTING_ANIMATION_DEDUCTION,
        // '态势推演列表',
        data: animationXmlList,
      },
    ]
    // const buttons = []
    return { data, buttons }
  } catch (error) {
    // const buttons = []
    const data = [
      {
        title: getLanguage(params.language).Map_Main_Menu
          .PLOTTING_ANIMATION_DEDUCTION,
        // '态势推演列表',
        data: [],
      },
    ]
    Toast.show(
      getLanguage(params.language).Prompt.NO_PLOTTING_DEDUCTION,
      // '当前场景无态势推演'
    )
    return { data, buttons }
  }
}

export default {
  getData,
  getCollectionData,
  getPlotOperationData,
  getAnimationWayData,
  getAnimationList,
}

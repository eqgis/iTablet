/* global GLOBAL */
import {
  SMap,
  STransportationAnalyst,
  SPlot,
  SNavigation,
  // SFacilityAnalyst,
} from 'imobile_for_reactnative'
import NavigationService from './NavigationService'
import { getLanguage } from '../language'
import { TouchType ,ChunkType} from '../constants'
// eslint-disable-next-line
import { Toast } from '../utils'
import ToolbarModule from './workspace/components/ToolBar/modules/ToolbarModule'
import {
  ConstToolType,
} from '../constants'
// eslint-disable-next-line
let _params = {}
let isDoubleTouchCome = false
function setGestureDetectorListener(params) {
  (async function() {
     SMap.setGestureDetector({
      singleTapHandler: touchCallback,
      longPressHandler: longtouchCallback,
      doubleTapHandler: doubleTouchCallback,
      magnPressHandler: magntouchCallback,
    })
  })()
  _params = params
}

async function isDoubleTouchComing() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(isDoubleTouchCome)
      isDoubleTouchCome = false
    }, 200)
  })
}

// eslint-disable-next-line no-unused-vars
async function doubleTouchCallback(event) {
  isDoubleTouchCome = true
}

async function magntouchCallback(event) {
  switch (global.TouchType) {
    case TouchType.NORMAL:
      if (global.Type === ChunkType.MAP_NAVIGATION){
        (async function () {
          await SNavigation.getStartPoint(event.LLPoint.x, event.LLPoint.y, false)
          global.STARTX = event.LLPoint.x
          global.STARTY = event.LLPoint.y
          //显示选点界面的顶部 底部组件
          global.MAPSELECTPOINT.setVisible(true)
          global.MAPSELECTPOINTBUTTON.setVisible(true, {
            button: getLanguage(global.language).Map_Main_Menu.SET_AS_START_POINT,
          })
          //全幅
          global.toolBox.showFullMap(true)
          //导航选点 全屏时保留mapController
          global.mapController && global.mapController.setVisible(true)
          // this.props.setMapNavigation({
          //   isShow: true,
          //   name: '',
          // })
        })()
      }
      break
    case TouchType.NAVIGATION_TOUCH_END:
      (async function () {
        await SNavigation.getEndPoint(event.LLPoint.x, event.LLPoint.y, false)
        global.ENDX = event.LLPoint.x
        global.ENDY = event.LLPoint.y
      })()
      break
    case TouchType.MAP_TOPO_SPLIT_BY_POINT: {
      const data = ToolbarModule.getData()
      const point = event.screenPoint
      data?.actions?.pointSplitLine(point)
      global.bubblePane && global.bubblePane.clear()
      break
    }
    case TouchType.MAP_TOPO_TRIM_LINE:
    // case TouchType.MAP_TOPO_EXTEND_LINE:
    {
      // const data = ToolbarModule.getData()
      const point = event.screenPoint
      ToolbarModule.addData({ point })
      let params = {
        point,
        ...global.INCREMENT_DATA,
        secondLine: true,
      }
      SNavigation.drawSelectedLineOnTrackingLayer(params)
      global.bubblePane && global.bubblePane.clear()
      break
    }
  }
}

async function longtouchCallback() {
  switch (global.TouchType) {
    case TouchType.NORMAL:
      break
    //   if (global.Type === ChunkType.MAP_NAVIGATION){
    //     (async function () {
    //       await SNavigation.getStartPoint(event.LLPoint.x, event.LLPoint.y, false)
    //       global.STARTX = event.LLPoint.x
    //       global.STARTY = event.LLPoint.y
    //       //显示选点界面的顶部 底部组件
    //       global.MAPSELECTPOINT.setVisible(true)
    //       global.MAPSELECTPOINTBUTTON.setVisible(true, {
    //         button: getLanguage(global.language).Map_Main_Menu.SET_AS_START_POINT,
    //       })
    //       //全幅
    //       global.toolBox.showFullMap(true)
    //       //导航选点 全屏时保留mapController
    //       global.mapController && global.mapController.setVisible(true)
    //       this.props.setMapNavigation({
    //         isShow: true,
    //         name: '',
    //       })
    //     })()
    //   }
    //   break
    // case TouchType.NAVIGATION_TOUCH_END:
    //   (async function () {
    //     await SNavigation.getEndPoint(event.LLPoint.x, event.LLPoint.y, false)
    //     global.ENDX = event.LLPoint.x
    //     global.ENDY = event.LLPoint.y
    //   })()
    //   break
  }
}
let isfull = false
async function touchCallback(event) {
  let guideInfo
  switch (global.TouchType) {
    // case TouchType.NAVIGATION_TOUCH_BEGIN:
    //   (async function() {
    //     await SNavigation.getStartPoint(event.LLPoint.x, event.LLPoint.y, false)
    //     global.STARTX = event.LLPoint.x
    //     global.STARTY = event.LLPoint.y
    //   })()
    //   break
    // case TouchType.NAVIGATION_TOUCH_END:
    //   (async function() {
    //     await SNavigation.getEndPoint(event.LLPoint.x, event.LLPoint.y, false)
    //     global.ENDX = event.LLPoint.x
    //     global.ENDY = event.LLPoint.y
    //   })()
    //   break
    case TouchType.NORMAL:
      // if (
      //   global.PoiInfoContainer &&
      //   global.PoiInfoContainer.state.resultList.length > 0 &&
      //   !global.PoiInfoContainer.state.showMore
      // ) {
      //   global.PoiInfoContainer.hidden()
      // }
      guideInfo = await SNavigation.isGuiding()
      if (
        !guideInfo.isOutdoorGuiding &&
        !guideInfo.isIndoorGuiding &&
        (!global.NAVIGATIONSTARTHEAD ||
          !global.NAVIGATIONSTARTHEAD.state.show) &&
        !global.PoiInfoContainer.state.visible &&
        (!global.MAPSELECTPOINT ||
          !global.MAPSELECTPOINT.state.show)
      ) {
        if (!(await isDoubleTouchComing())) {
          if (isfull) {
            global.toolBox && global.toolBox.existFullMap()
          } else {
            global.toolBox && global.toolBox.showFullMap()
          }
          isfull = !isfull
        }
      }
      break
    case TouchType.MAP_NAVIGATION:
      if (
        global.PoiInfoContainer &&
        global.PoiInfoContainer.state.resultList.length > 0 &&
        !global.PoiInfoContainer.state.showMore
      ) {
        global.PoiInfoContainer.hidden()
      }
      break
    case TouchType.MAP_MARKS_TAGGING:
      NavigationService.navigate('InputPage', {
        headerTitle: getLanguage(global.language).Map_Main_Menu.TOOLS_NAME,
        // type: 'name',
        cb: async value => {
          if (value !== '') {
            const datasourceName = global.currentLayer.datasourceAlias
            const { datasetName } = global.currentLayer
            await SMap.addTextRecordset(
              datasourceName,
              datasetName,
              value,
              event.screenPoint.x,
              event.screenPoint.y,
            )
            global.HAVEATTRIBUTE = true
            NavigationService.goBack()
            //global.TouchType = TouchType.NORMAL
          }
        },
        backcb: async () => {
          NavigationService.goBack()
        },
      })
      break
    case TouchType.SET_START_STATION:
      STransportationAnalyst.setStartPoint(
        event.screenPoint,
        getLanguage(global.language).Analyst_Labels.START_STATION,
      )
      break
    case TouchType.MIDDLE_STATIONS:
      STransportationAnalyst.addNode(
        event.screenPoint,
        getLanguage(global.language).Analyst_Labels.MIDDLE_STATION,
      )
      break
    case TouchType.SET_END_STATION:
      STransportationAnalyst.setEndPoint(
        event.screenPoint,
        getLanguage(global.language).Analyst_Labels.END_STATION,
      )
      break
    case TouchType.SET_AS_START_STATION:
      STransportationAnalyst.setStartPoint(
        event.screenPoint,
        getLanguage(global.language).Analyst_Labels.START_STATION,
      )
      // SFacilityAnalyst.setStartPoint(event.screenPoint)
      break
    case TouchType.SET_AS_END_STATION:
      STransportationAnalyst.setEndPoint(
        event.screenPoint,
        getLanguage(global.language).Analyst_Labels.END_STATION,
      )
      // SFacilityAnalyst.setEndPoint(event.screenPoint)
      break
    case TouchType.ADD_STATIONS:
      STransportationAnalyst.addNode(
        event.screenPoint,
        getLanguage(global.language).Analyst_Labels.NODE,
      )
      break
    case TouchType.ADD_BARRIER_NODES:
      STransportationAnalyst.addBarrierNode(
        event.screenPoint,
        getLanguage(global.language).Analyst_Labels.BARRIER_NODE,
      )
      break
    case TouchType.ANIMATION_WAY:
      SPlot.addAnimationWayPoint(event.screenPoint, true)
      break
    case TouchType.MAP_SELECT_POINT: {
      const point = await SMap.pixelPointToMap(event.screenPoint)
      global.MAPSELECTPOINT.updateLatitudeAndLongitude(point)
      // SMap.deleteMarker(global.markerTag)
      SMap.showMarker(point.x, point.y, global.markerTag)
      break
    }
    // case TouchType.MAP_TOPO_SPLIT_BY_POINT: {
    //   const data = ToolbarModule.getData()
    //   const point = event.screenPoint
    //   data?.actions?.pointSplitLine(point)
    //   break
    // }
    case TouchType.MAP_TOPO_TRIM_LINE:
    case TouchType.MAP_TOPO_EXTEND_LINE: {
      // const data = ToolbarModule.getData()
      const point = event.screenPoint
      ToolbarModule.addData({ point })
      let params = {
        point,
        ...global.INCREMENT_DATA,
        secondLine: true,
      }
      SNavigation.drawSelectedLineOnTrackingLayer(params)
      global.bubblePane && global.bubblePane.clear()
      break
    }
    case TouchType.ADD_NODES:
    case TouchType.NULL:
      break
  }
}

export { setGestureDetectorListener }

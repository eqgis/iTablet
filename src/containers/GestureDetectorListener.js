import {
  SMap,
  STransportationAnalyst,
  // SFacilityAnalyst,
} from 'imobile_for_reactnative'
import NavigationService from './NavigationService'
import { getLanguage } from '../language'
import { TouchType } from '../constants'
// eslint-disable-next-line
import { Toast } from '../utils'
// eslint-disable-next-line
let _params = {}
let isDoubleTouchCome = false
function setGestureDetectorListener(params) {
  (async function() {
    await SMap.setGestureDetector({
      singleTapHandler: touchCallback,
      longPressHandler: longtouchCallback,
      doubleTapHandler: doubleTouchCallback,
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

async function longtouchCallback() {
  switch (GLOBAL.TouchType) {
    case TouchType.NORMAL:
      break
  }
}
let isfull = false
async function touchCallback(event) {
  let guideInfo
  switch (GLOBAL.TouchType) {
    case TouchType.NAVIGATION_TOUCH_BEGIN:
      (async function() {
        await SMap.getStartPoint(event.LLPoint.x, event.LLPoint.y, false)
        GLOBAL.STARTX = event.LLPoint.x
        GLOBAL.STARTY = event.LLPoint.y
      })()
      break
    case TouchType.NAVIGATION_TOUCH_END:
      (async function() {
        await SMap.getEndPoint(event.LLPoint.x, event.LLPoint.y, false)
        GLOBAL.ENDX = event.LLPoint.x
        GLOBAL.ENDY = event.LLPoint.y
      })()
      break
    case TouchType.NORMAL:
      if (
        GLOBAL.PoiInfoContainer &&
        GLOBAL.PoiInfoContainer.state.resultList.length > 0 &&
        !GLOBAL.PoiInfoContainer.state.showMore
      ) {
        GLOBAL.PoiInfoContainer.hidden()
      }
      guideInfo = await SMap.isGuiding()
      if (
        !guideInfo.isOutdoorGuiding &&
        !guideInfo.isIndoorGuiding &&
        (!GLOBAL.NAVIGATIONSTARTHEAD ||
          !GLOBAL.NAVIGATIONSTARTHEAD.state.show) &&
        !GLOBAL.PoiInfoContainer.state.visible
      ) {
        if (!(await isDoubleTouchComing())) {
          if (isfull) {
            GLOBAL.toolBox && GLOBAL.toolBox.existFullMap()
          } else {
            GLOBAL.toolBox && GLOBAL.toolBox.showFullMap()
          }
          isfull = !isfull
        }
      }
      break
    case TouchType.MAP_TOOL_TAGGING:
      NavigationService.navigate('InputPage', {
        headerTitle: getLanguage(global.language).Map_Main_Menu.TOOLS_NAME,
        type: 'name',
        cb: async value => {
          if (value !== '') {
            const datasourceName = GLOBAL.currentLayer.datasourceAlias
            const { datasetName } = GLOBAL.currentLayer
            await SMap.addTextRecordset(
              datasourceName,
              datasetName,
              value,
              event.screenPoint.x,
              event.screenPoint.y,
            )
            NavigationService.goBack()
            //GLOBAL.TouchType = TouchType.NORMAL
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
      SMap.addAnimationWayPoint(event.screenPoint, true)
      break
    case TouchType.MAP_SELECT_POINT: {
      const point = await SMap.pixelPointToMap(event.screenPoint)
      GLOBAL.MAPSELECTPOINT.updateLatitudeAndLongitude(point)
      SMap.deleteMarker(118081)
      SMap.showMarker(point.x, point.y, 118081)
      break
    }
    case TouchType.ADD_NODES:
    case TouchType.NULL:
      break
  }
}

export { setGestureDetectorListener }

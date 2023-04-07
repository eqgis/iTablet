/**
 * 3维场景标注管理
 */

import { getLanguage } from "@/language"
import { AppInputDialog, AppUser } from "@/utils"
import AppRoot, { UserRoot } from "@/utils/AppPath"
import DataLocal from "@/utils/DataHandler/DataLocal"
import { FileTools, SScene } from "imobile_for_reactnative"
import { GeometryType, Point3D, GeoPlacemark } from "imobile_for_reactnative/NativeModule/interfaces/data/SData"
import { AltitudeMode, GeoStyle3D, Layer3DType } from "imobile_for_reactnative/NativeModule/interfaces/scene/SScene"

const kmlFileName = 'NodeAnimation.kml'

let kmlPath = ''

let kmlFull = ''




//*********************************** 公共方法 *****************************************************

/**
 * 打开场景后添加kml标注图层
 */
async function addLabelLayer(scenename: string, isOnlineScene: boolean) {

  const homePath = await FileTools.getHomeDirectory()
  const scenePath = homePath + AppRoot.User.path + '/' + AppUser.getCurrentUser().userName + UserRoot.Data.ARScene.path

  let path = ''
  if(isOnlineScene) {
    path = scenePath + '/' + scenename + '_ol/kml'
  } else {
    const pxpPath = scenePath + '/' + scenename + '.pxp'
    const pxp = await DataLocal.getPxpContent(pxpPath)
    if(pxp === null) return
    path = scenePath + '/' + pxp.Workspace.server
  }

  kmlPath = path.substring(0, path.lastIndexOf('/')) + '/files'

  kmlFull = kmlPath + '/' + kmlFileName

  const isExist = await FileTools.fileIsExist(kmlFull)

  if(!isExist) {
    await FileTools.createDirectory(kmlPath)
    await FileTools.createFile(kmlFull)
  }

  const result = await SScene.addLayer(kmlFull, Layer3DType.KML, 'NodeAnimation', true)

  return result
}

/** 清空标注图层所有保存的标注 */
async function clearLabelLayer(){
  await SScene.removeLayer('NodeAnimation')
  await FileTools.deleteFile(kmlFull)
  await FileTools.createFile(kmlFull)
  await SScene.addLayer(kmlFull, Layer3DType.KML, 'NodeAnimation', true)
}


async function undo() {
  if(labelType === 'line') {
    await undoLine()
  }
  if(labelType === 'region') {
    await undoRegion()
  }
  if(labelType === 'text') {
    await undoText()
  }
  if(labelType === 'favorite') {
    await undoFavorite()
  }
}

function clear() {
  poi = null
  texts.clear()
  textStack = []
  lines = []
  labelType = ''
  SScene.clearTrackingLayer()
}

async function save() {
  if(labelType === 'line') {
    await saveLine()
  }
  if(labelType === 'region') {
    await saveRegion()
  }
  if(labelType === 'text') {
    await saveText()
  }
  if(labelType === 'favorite') {
    await saveFavorite()
  }

  labelType = ''
  await SScene.saveLayerAsKml('NodeAnimation', kmlFull)

  SScene.clearTrackingLayer()
}



/** 兴趣点的风格 */
const geoFavoriteStyle: Partial<GeoStyle3D> = {
  altitudeMode: AltitudeMode.ABSOLUTE,
  markerScale: 2,
  markerFile: 'APP://config/Resource/icon_green.png'
}

/** 标注文字的风格 */
const geoText3DStyle: Partial<GeoStyle3D> = {
  altitudeMode: AltitudeMode.ABSOLUTE,
}

/** 标注线的风格 */
const geoLine3DStyle: Partial<GeoStyle3D> = {
  lineColor: {r:18, g:183, b:245},
  lineWidth: 15,
  altitudeMode: AltitudeMode.ABSOLUTE,
}

/** 标注面的风格 */
const geoRegion3DStyle: Partial<GeoStyle3D> = {
  fillForeColor: {r:140, g:224, b:80},
  lineColor: {r:18, g:183, b:245},
  lineWidth: 5,
  altitudeMode: AltitudeMode.ABSOLUTE,
}

/** 当前绘制类型 */
let labelType: '' | 'point' | 'line' | 'region' | 'text' | 'favorite' = ''
/** 当前添加的点 */
let lines: Point3D[] = []


//***********************************绘制兴趣点 *****************************************************

let poi: GeoPlacemark | null = null

/** 开始监听手势绘制兴趣点 */
function drawFavorite() {
  labelType = 'favorite'

  SScene.setTracking3DListener(async result => {
    await SScene.clearTrackingLayer()
    poi = {
      type: GeometryType.GEOPLACEMARK,
      point: result,
      text: getLanguage().POI
    }
    await SScene.addGeometryToTrackingLayer({...poi}, 'favorite', geoFavoriteStyle)
  })
}

async function undoFavorite() {
  if(labelType === 'favorite') {
    await SScene.clearTrackingLayer()
  }
}

async function saveFavorite() {
  if(labelType === 'favorite' && poi) {
    await SScene.addGeometryToLayer('NodeAnimation', {...poi}, geoFavoriteStyle)
  }
}




//***********************************绘制文字 *****************************************************


const texts = new Map<string, GeoPlacemark>()
let textStack: string[] = []

function _getTag(): string {
  let tag = 'tag'
  let num = 1
  while(texts.has(tag)) {
    tag = tag + num
    num++
  }
  return tag
}


/** 开始监听手势绘制线 */
function drawText3D() {
  texts.clear()
  textStack = []
  labelType = 'text'

  SScene.setTracking3DListener(async result => {
    AppInputDialog.show({
      title: '请输入文字',
      confirm: async text => {
        const geoText: GeoPlacemark = {
          type: GeometryType.GEOPLACEMARK,
          point: result,
          text: text
        }
        const tag = _getTag()
        const r = await SScene.addGeometryToTrackingLayer({...geoText}, tag, geoText3DStyle)
        if(r) {
          textStack.push(tag)
          texts.set(tag, geoText)
        }

      }
    })
  })
}

/** 撤销线绘制的一个点 */
async function undoText() {
  if(labelType === 'text' && textStack.length > 0) {
    const tag = textStack.pop()
    if(tag) {
      SScene.removeGeometryFromTrackingLayer(tag)
      texts.delete(tag)
    }
  }
}

/** 保存绘制的线到kml图层 */
async function saveText() {
  if(labelType === 'text' && textStack.length > 0) {
    for(let i = 0; i < textStack.length; i++) {
      const tag = textStack[i]
      const geo = texts.get(tag)
      if(geo) {
        await SScene.addGeometryToLayer('NodeAnimation', geo, geoLine3DStyle)
      }
    }
    texts.clear()
    textStack = []
  }
}

//***********************************绘制线 *****************************************************

/** 开始监听手势绘制线 */
function drawLine3D() {
  lines = []
  labelType = 'line'

  SScene.setTracking3DListener(async result => {
    lines.push({...result})
    if(lines.length > 1) {
      await SScene.removeGeometryFromTrackingLayer('geoline')
      SScene.addGeometryToTrackingLayer({type: GeometryType.GEOLINE3D, points: [...lines]}, 'geoline', geoLine3DStyle)
    }
  })
}

/** 撤销线绘制的一个点 */
async function undoLine() {
  if(labelType === 'line' && lines.length > 0) {
    lines.pop()
    await SScene.removeGeometryFromTrackingLayer('geoline')
    if(lines.length > 1) {
      SScene.addGeometryToTrackingLayer({type: GeometryType.GEOLINE3D, points: [...lines]}, 'geoline', geoLine3DStyle)
    }
  }
}

/** 保存绘制的线到kml图层 */
async function saveLine() {
  if(labelType === 'line' && lines.length > 1) {
    await SScene.addGeometryToLayer('NodeAnimation', {type: GeometryType.GEOLINE3D, points: [...lines]}, geoLine3DStyle)
    lines = []
  }
}



//***********************************绘制面 *****************************************************

/** 开始监听手势绘制面 */
function drawRegion3D() {
  lines = []
  labelType = 'region'

  SScene.setTracking3DListener(async result => {
    lines.push({...result})
    if(lines.length > 2) {
      await SScene.removeGeometryFromTrackingLayer('georegion')
      SScene.addGeometryToTrackingLayer({type: GeometryType.GEOREGION3D, points: [...lines]}, 'georegion', geoRegion3DStyle)
    }
  })
}

async function undoRegion() {
  if(labelType === 'region' && lines.length > 0) {
    lines.pop()
    await SScene.removeGeometryFromTrackingLayer('georegion')
    if(lines.length > 2) {
      SScene.addGeometryToTrackingLayer({type: GeometryType.GEOREGION3D, points: [...lines]}, 'georegion', geoRegion3DStyle)
    }
  }
}

async function saveRegion() {
  if(labelType === 'region' && lines.length > 2) {
    await SScene.addGeometryToLayer('NodeAnimation', {type: GeometryType.GEOREGION3D, points: [...lines]}, geoRegion3DStyle)
    lines = []
  }
}








export default {
  addLabelLayer,
  clearLabelLayer,

  undo,
  clear,
  save,

  drawFavorite,
  drawText3D,
  drawLine3D,
  drawRegion3D,
}
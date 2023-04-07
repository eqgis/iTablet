import { SMap, SScene } from "imobile_for_reactnative"
import { GeometryType, LongitudeAndLatitude } from "imobile_for_reactnative/NativeModule/interfaces/data/SData"
import { AltitudeMode, GeoStyle3D } from "imobile_for_reactnative/NativeModule/interfaces/scene/SScene"


const positionMarkStyle: Partial<GeoStyle3D> = {
  altitudeMode: AltitudeMode.ABSOLUTE,
  markerScale: 2,
  markerFile: 'APP://config/Resource/icon_green.png'
}

const positiontag = 'scene_tracking_tag_position'


/**
 * 飞行当当前点并显示定位点
 */
async function flyToCurrent() {

  await SScene.removeGeometryFromTrackingLayer(positiontag)

  const location = await SMap.getCurrentLocation()

  SScene.setCameraHeading(0)
  SScene.flyToPoint({x: location.longitude, y: location.latitude, z: 1500}, 5000)
  SScene.addGeometryToTrackingLayer({type: GeometryType.GEOPLACEMARK, point: {x: location.longitude, y: location.latitude, z: 500}, text: ''}, positiontag, positionMarkStyle)

}

/**
 * 飞行到指定位置
 * @param name 指定位置显示名称
 * @param location 经纬度
 */
async function flyToPlace(name: string, location: LongitudeAndLatitude) {

  await SScene.removeGeometryFromTrackingLayer(positiontag)
  SScene.setCameraHeading(0)
  SScene.flyToPoint({x: location.longitude, y: location.latitude, z: 1500}, 5000)
  SScene.addGeometryToTrackingLayer({type: GeometryType.GEOPLACEMARK, point: {x: location.longitude, y: location.latitude, z: 500}, text: name}, positiontag, positionMarkStyle)

}


export default {
  flyToCurrent,
  flyToPlace,
}
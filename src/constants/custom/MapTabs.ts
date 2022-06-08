/** Map预留Tab名称 **/
const MapTabs: TMapTabs = {
  MapView: 'MapView',
  LayerManager: 'LayerManager', // 图层管理
  LayerAttribute: 'LayerAttribute', // 属性
  MapSetting: 'MapSetting', // 设置
  Scene: 'Scene', // 我的
  Layer3DManager: 'Layer3DManager', // 三维图层管理
  LayerAttribute3D: 'LayerAttribute3D', // 三维属性
  Map3DSetting: 'Map3DSetting', // 三维设置
  ARLayerManager: 'ARLayerManager', // AR图层
  ARMapSetting: 'ARMapSetting', // AR设置
}

export interface TMapTabs {
  MapView: 'MapView',
  LayerManager: 'LayerManager', // 图层管理
  LayerAttribute: 'LayerAttribute', // 属性
  MapSetting: 'MapSetting', // 设置
  Scene: 'Scene', // 我的
  Layer3DManager: 'Layer3DManager', // 三维图层管理
  LayerAttribute3D: 'LayerAttribute3D', // 三维属性
  Map3DSetting: 'Map3DSetting' // 三维设置
  ARLayerManager: 'ARLayerManager', // AR图层
  ARMapSetting: 'ARMapSetting', // AR设置
}

export default MapTabs
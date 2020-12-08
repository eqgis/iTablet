/** App自带模块 **/
import * as AppModule from '../../src/customModule/mapModules'

/** 自定义模块 **/
// import MapExample from './MapExample'
// import TourModule from './TourModule'

/** export顺序为首页模块显示顺序 **/
const mapModules = [
  AppModule.MapARMapping,
  AppModule.MapEditConfig,
  AppModule.Map3DConfig,
  AppModule.MapARConfig,
  AppModule.MapThemeConfig,
  AppModule.MapARAnalysis,
  AppModule.MapCollectionConfig,
  AppModule.MapNavigationConfig,
  AppModule.MapPlottingConfig,
  AppModule.MapAnalystConfig,
  // MapExample,
  // TourModule,
]

export default (function () {
  return mapModules.map(item => item.key)
})()

export { mapModules }
/** App自带模块 **/
import * as AppModule from '../../src/customModule/mapModules'

/** 自定义模块 **/
// import MapExample from './MapExample'
// import TourModule from './TourModule'
import CoworkModule from './CoworkModule'

/** export顺序为首页模块显示顺序 **/
const mapModules = [
  // AppModule.MapARMapping,
  CoworkModule,
  AppModule.MapThemeConfig,
  AppModule.MapEditConfig,
  AppModule.Map3DConfig,
  // AppModule.MapARAnalysis,
  AppModule.MapNavigationConfig,
  AppModule.MapARConfig,
  AppModule.MapCollectionConfig,
  // AppModule.MapPlottingConfig,
  // AppModule.MapAnalystConfig,
  // MapExample,
  // TourModule,
]

export default (function () {
  return mapModules.map(item => item.key)
})()

export { mapModules }
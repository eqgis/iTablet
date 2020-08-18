/** App自带模块 **/
import * as AppModule from '../../src/customModule/mapModules'

/** 自定义模块 **/
// import MapExample from './MapExample'

/** export顺序为首页模块显示顺序 **/
const mapModules = [
  AppModule.MapARConfig,
  AppModule.MapARAnalysis,
  AppModule.MapARMeasure,
  AppModule.MapEditConfig,
  AppModule.Map3DConfig,
  AppModule.MapCollectionConfig,
  AppModule.MapNavigationConfig,
  AppModule.MapThemeConfig,
  AppModule.MapPlottingConfig,
  AppModule.MapAnalystConfig,
  // MapExample,
]

export default (function () {
  return mapModules.map(item => item.key)
})()

export { mapModules }
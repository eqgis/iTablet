/** App自带模块 **/
import * as AppModule from '../../src/customModule/mapModules'

/** 自定义模块 **/
// import MapExample from './MapExample'

/** export顺序为首页模块显示顺序 **/
export default [
  AppModule.MapEditConfig,
  AppModule.Map3DConfig,
  AppModule.MapCollectionConfig,
  AppModule.MapARConfig,
  AppModule.MapNavigationConfig,
  AppModule.MapThemeConfig,
  AppModule.MapPlottingConfig,
  AppModule.MapAnalystConfig,
  // new MapExample(),
]
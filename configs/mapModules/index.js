/** App自带模块 **/
import * as AppModule from '../../src/customModule/mapModules'

/** 自定义模块 **/
// import MapExample from './MapExample'

/** export顺序为首页模块显示顺序 **/
export default [
  new AppModule.MapEditConfig(),
  new AppModule.Map3DConfig(),
  new AppModule.MapCollectionConfig(),
  new AppModule.MapARConfig(),
  new AppModule.MapNavigationConfig(),
  // new MapExample(),
  new AppModule.MapThemeConfig(),
  new AppModule.MapPlottingConfig(),
  new AppModule.MapAnalystConfig(),
]
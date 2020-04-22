import MapEditConfig from './MapEditConfig'
import MapAnalystConfig from './MapAnalystConfig'
import Map3DConfig from './Map3DConfig'
import MapARConfig from './MapARConfig'
import MapCollectionConfig from './MapCollectionConfig'
import MapNavigationConfig from './MapNavigationConfig'
import MapPlottingConfig from './MapPlottingConfig'
import MapThemeConfig from './MapThemeConfig'
import TestConfig from './TestConfig'

/** export顺序为首页模块显示顺序 **/
export default [
  new MapEditConfig(),
  new Map3DConfig(),
  new MapCollectionConfig(),
  new MapARConfig(),
  new MapNavigationConfig(),
  new MapThemeConfig(),
  new MapPlottingConfig(),
  new MapAnalystConfig(),
  new TestConfig(),
]
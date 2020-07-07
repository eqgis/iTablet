import mapModules from './mapModules/index'
import tabModules from './tabModules/index'

export default {
  // name: '全功能移动GIS软件',
  name: 'SuperMap iTablet',
  alias: 'iTablet',
  version: '0.0.1',
  language: 'CN',
  supportLanguage: [],
  about: {
    isShow: true,
    url: '',
  },
  login: ['Online', 'iPortal'],
  tabModules: tabModules,//组册首页底部模块
  mapModules: mapModules,//组册首页模块
  mineModules: [
    {key: 'IMPORT'},
    {key: 'MY_SERVICE'},
    {key: 'DATA'},
    {key: 'MARK'},
    {key: 'MAP'},
    {key: 'SCENE'},
    {key: 'BASE_MAP'},
    {key: 'SYMBOL'},
    {key: 'TEMPLATE'},
    {key: 'MyColor'},
    {key: 'MyApplet'},
    {key: 'AIModel'},
  ],
  infoServer: {
    url: 'https://www.supermapol.com/web/datas/235674088/download',
    fileName: 'ServerInfo.geojson',
  },
}
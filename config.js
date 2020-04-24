import { mapModules, tabModules } from './configs'

export default {
  name: 'SuperMap iTablet',
  alias: 'iTablet',
  version: '0.0.1',
  language: 'CN',
  about: {
    isShow: true,
    url: ''
  },
  login: ['Online', 'iPortal'],
  tabModules: tabModules,
  mapModules: mapModules,
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
    {key: 'MyColor'}
  ],
  infoServer: {
    url: 'https://www.supermapol.com/web/datas/235674088/download',
    fileName: 'ServerInfo.geojson'
  }
}
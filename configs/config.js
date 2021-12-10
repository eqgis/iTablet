import mapModules from './mapModules/index'
import tabModules from './tabModules/index'

const iportalMQIP = '192.168.11.206'

export default {
  // name: '全功能移动GIS软件',
  name: '外业采集系统',
  alias: 'iTablet',
  version: '0.0.1',
  launchGuideVersion: '0.0.3',
  language: 'AUTO',
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
    {key: 'ARMAP'},
    {key: 'ARMODEL'},
    {key: 'AREFFECT'},
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
  messageServer: {
    MSG_ADDRESS: `http://${iportalMQIP}:8190/iportal/web`,
    MSG_IP: iportalMQIP,
    MSG_Port: 5672,
    MSG_HostName: '/',
    MSG_UserName: 'admin',
    MSG_Password: 'admin',
    MSG_HTTP_Port: 15672,
    FILE_UPLOAD_SERVER_URL : `http://${iportalMQIP}:8124/upload`,
    FILE_DOWNLOAD_SERVER_URL: `http://${iportalMQIP}:8124/download`,
  },
}
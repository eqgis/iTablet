import mapModules from './mapModules/index'
import tabModules from './tabModules/index'

const iportalMQIP = '192.168.11.215'
const IPORTAL_PORT = '8190'
// const iportalMQIP = '10.10.3.194'
// const IPORTAL_PORT = '8089'
const IPORTAL_IP = iportalMQIP
const MQ_IP = iportalMQIP
const FILE_MANAGE_IP = iportalMQIP

export default {
  name: '外业采集协作',
  alias: '外业采集协作',
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
    // {key: 'ARMAP'},
    // {key: 'ARMODEL'},
    // {key: 'AREFFECT'},
    {key: 'SCENE'},
    {key: 'BASE_MAP'},
    {key: 'SYMBOL'},
    {key: 'TEMPLATE'},
    {key: 'MyColor'},
    {key: 'MyApplet'},
    // {key: 'AIModel'},
  ],
  infoServer: {
    url: 'https://www.supermapol.com/web/datas/235674088/download',
    fileName: 'ServerInfo.geojson',
  },
  messageServer: {
    MSG_ADDRESS: `http://${IPORTAL_IP}:${IPORTAL_PORT}/iportal/web`,
    MSG_IP: MQ_IP,
    MSG_Port: 5672,
    MSG_HostName: '/',
    MSG_UserName: 'admin',
    MSG_Password: 'admin',
    MSG_HTTP_Port: 15672,
    FILE_UPLOAD_SERVER_URL : `http://${FILE_MANAGE_IP}:8124/upload`,
    FILE_DOWNLOAD_SERVER_URL: `http://${FILE_MANAGE_IP}:8124/download`,
  },
}
import screen, { scaleSize, fixedSize, setSpText, fixedText, dp } from './screen'
import dataUtil from './dataUtil'
import Toast from './Toast'
import * as constUtil from './constUtil'
import AudioAnalyst from './AudioAnalyst/AudioAnalyst'
import checkType from './checkType'
import jsonUtil from './jsonUtil'
import FetchUtils from './FetchUtils'
import LayerUtils from './LayerUtils'
import ModelUtils from './ModelUtils'
import request from './request'
import AnalystTools from './AnalystTools'
import StyleUtils from './StyleUtils'
import OnlineServicesUtils from './OnlineServicesUtils'
import Audio from './Audio'
import ResultInfo from './ResultInfo'
import DialogUtils from './DialogUtils'
import AppProgress from './AppProgress'
import SCoordinationUtils from './SCoordinationUtils'
import DateUtil from './DateUtil'
import * as pinyin from './pinyin'
import DownloadUtil from './DownloadUtil'
import GetUserBaseMapUtil from './GetUserBaseMapUtil'
import * as AppStyle from './AppStyle'
import * as AppLog from './AppLog'
import AppToolBar from './AppToolBar'
import AppEvent from './AppEvent/AppEvent'
import AppUser from './AppUser'
import AppDialog from './AppDialog'
import AppInputDialog from './AppInputDialog'
import AttributeUtils from './AttributeUtils'
import DataHandler from './DataHandler'
import AppPath from './AppPath'
import { FetchBlob } from './FetchBlob'

export { CheckSpell } from './CheckUtils'
export { FloatMath } from './FloatMath'

export {
  screen,
  dp,
  scaleSize,
  fixedSize,
  dataUtil,
  constUtil,
  Toast,
  AudioAnalyst,
  checkType,
  jsonUtil,
  FetchUtils,
  setSpText,
  fixedText,
  request,
  /** 地图公共方法 * */
  LayerUtils,
  ModelUtils,
  GetUserBaseMapUtil, // 加载当前登录用户的底图数组
  /** 分析公共方法 * */
  AnalystTools,
  StyleUtils,
  OnlineServicesUtils,
  Audio,
  ResultInfo,
  DialogUtils,
  AppProgress,
  SCoordinationUtils,
  DateUtil,
  pinyin,
  DownloadUtil,
  AppStyle,
  AppEvent,
  AppUser,
  AppDialog,
  AppInputDialog,
  AttributeUtils,
  DataHandler,
  AppPath,
  FetchBlob,
}

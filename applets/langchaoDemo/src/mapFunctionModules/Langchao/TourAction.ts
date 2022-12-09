// import React from 'react'
import { SCollector, SMap, SMediaCollector, SMCollectorType } from 'imobile_for_reactnative'
import { FileTools } from '@/native'
import { ConstPath } from '@/constants'
import { AppToolBar, LayerUtils, Toast } from '@/utils'
import { getLanguage } from '@/language'
import { ImagePicker } from '@/components'
import ToolbarModule from '@/containers/workspace/components/ToolBar/modules/ToolbarModule'
import { MediaData } from 'imobile_for_reactnative/types/interface/collector/SMediaCollector'
import { SuperMapKnown } from '@/containers/tabs'
import { collectionModule } from '@/containers/workspace/components/ToolBar/modules'
import { getJson } from '../../assets/data'
import { uploadFile, MessageInfoType, message } from '../../utils/langchaoServer'

/**
 * 右侧创建轨迹事件
 */
async function tour() {
  try {
    await SMap.checkCurrentModule()
    const _params: any = ToolbarModule.getParams()
    const targetPath = await FileTools.appendingHomeDirectory(
      `${ConstPath.UserPath + _params.user.currentUser.userName}/${
        ConstPath.RelativeFilePath.Media
      }`,
    )
    SMediaCollector.initMediaCollector(targetPath)

    let tourLayer: string
    ImagePicker.AlbumListView.defaultProps.showDialog = true
    ImagePicker.AlbumListView.defaultProps.dialogConfirm = async (
      value = '',
      cb = () => {},
    ) => {
      try {
        if (value !== '') {
          await SMap.setLabelColor()
          const tagginData = await SMap.newTaggingDataset(
            value,
            _params.user.currentUser.userName,
            false, // 轨迹图层都设置为不可编辑
            'tour',
          )
          tourLayer = tagginData.layerName
          cb && cb()
        }
        Toast.show(value)
      } catch (error: any) {
        if (error?.code === 'INVALID_MODULE') {
          ImagePicker.hide()
        }
      }
    }

    ImagePicker.AlbumListView.defaultProps.assetType = 'All'
    ImagePicker.AlbumListView.defaultProps.groupTypes = 'All'

    ImagePicker.getAlbum({
      maxSize: 9,
      callback: async (data: MediaData[]) => {
        if (data.length <= 1) {
          Toast.show(
            getLanguage(global.language).Prompt.SELECT_TWO_MEDIAS_AT_LEAST,
          )
          return
        }
        if (tourLayer) {
          const res = await SMediaCollector.addTour(tourLayer, data)
          res.result && (await SMap.setLayerFullView(tourLayer))
        }
      },
    })
  } catch(e) {
    __DEV__ && console.warn(e)
  }
}

const showLoading = (time: number, callback?: () => void) => {
  global.Loading.setLoading(true, "上报中")
  setTimeout(() => {
    global.Loading.setLoading(false)
    callback && callback()
  }, time)
}

/** 顶上的位置上传按钮 */
const positionUpload = async () => {
  // showLoading(2000, async () => {
  //   // // await SMap.moveToCurrent()
  //   // // await SMap.removeAllCallout()
  //   // const position = await SMap.getCurrentLocation()
  //   // // await SMap.addLocationCallout(position.longitude, position.latitude, '当前位置', "2")
  //   // await SMap.addCallouts([{
  //   //   x: position.longitude,
  //   //   y: position.latitude,
  //   // }])
  //   // // 地图定位到指定点位置
  //   // await SMap.toLocationPoint({
  //   //   x: position.longitude,
  //   //   y: position.latitude,
  //   // })

  //   // await SMap.setMapScale(1 / 2785.0)
  //   // await SMap.setMapCenter(position.longitude, position.latitude)
  //   // await SMap.refreshMap()
  //   Toast.show("上报成功")
  // })
  // ==============================================================================
  // const data = {"name":"专用公路","type":"line","id":965018}
  // await AppToolBar.getProps().setCurrentSymbol(data)
  // const type = SMCollectorType.LINE_GPS_PATH
  // ToolbarModule.addData({
  //   lastType: type,
  //   lastLayer:undefined,
  // })
  // await collectionModule().actions.createCollector(type, undefined)
  // // await SCollector.startCollect(type)

  showLoading(2000, async () => {
    // await SCollector.startCollect(type)

    const type = SMCollectorType.LINE_GPS_PATH
    await collectionModule().actions.collectionSubmit(type)
    await SCollector.stopCollect()
    Toast.show("上报成功")
  })

}

/** 时间格式化 "yyyy-MM-dd hh:mm:ss"（12小时制）  "yyyy-MM-dd HH:mm:ss"（24小时制） */
const dateFormat = (format: string, date: Date) => {
  let formatstr = format
  console.warn("formatstr01: " + formatstr + " - " + date.getFullYear())
  if(format != null && format != ""){
    //设置年
    if(formatstr.indexOf("yyyy") >=0 ){
      formatstr = formatstr.replace("yyyy",date.getFullYear() + "")
    }
    console.warn("formatstr02: " + formatstr)
    //设置月
    if(formatstr.indexOf("MM") >=0 ){
      let month: number | string = date.getMonth() + 1
      if(month < 10){
        month = "0" + month
      }
      formatstr = formatstr.replace("MM",month + "")
    }
    console.warn("formatstr03: " + formatstr)
    //设置日
    if(formatstr.indexOf("dd") >=0 ){
      let day: number | string = date.getDay()
      if(day < 10){
        day = "0" + day
      }
      formatstr = formatstr.replace("dd",day + "")
    }
    console.warn("formatstr04: " + formatstr)
    //设置时 - 24小时
    let hours: number | string = date.getHours()
    if(formatstr.indexOf("HH") >=0 ){
      if(hours < 10){
        hours = "0" + hours
      }
      formatstr = formatstr.replace("HH",hours + "")
    }
    //设置时 - 12小时
    if(formatstr.indexOf("hh") >=0 ){
      if(hours > 12){
        hours = Number(hours) - 12
      }
      if(hours < 10){
        hours = "0" + hours
      }
      formatstr = formatstr.replace("hh",hours + "")
    }
    console.warn("formatstr05: " + formatstr)
    //设置分
    if(formatstr.indexOf("mm") >=0 ){
      let minute: number | string = date.getMinutes()
      if(minute < 10){
        minute = "0" + minute
      }
      formatstr = formatstr.replace("mm",minute + "")
    }
    console.warn("formatstr06: " + formatstr)
    //设置秒
    if(formatstr.indexOf("ss") >=0 ){
      let second: number | string = date.getSeconds()
      if(second < 10){
        second = "0" + second
      }
      formatstr = formatstr.replace("ss",second + "")
    }
    console.warn("formatstr07: " + formatstr)
  }
  return formatstr
}

interface countryCodeType {
  name: string,
  codeId: number,
}

const getCountryCode = async (lon: number, lat: number) => {
  let code = -1
  try {
    const bounds = {
      x: lon,
      y: lat,
      sizeX: 1,
      sizeY: 1,
    }
    const result = await SMap.query("country", "Country_84", bounds)
    console.warn("result: " + JSON.stringify(result) + "\n bounds: " + JSON.stringify(bounds))
    if(result && result.length > 0) {
      const length = result.length
      const countrycodeData = getJson().contryCode
      countrycodeData.map((item: countryCodeType) => {
        if(item.name === result[length - 1].Country) {
          code = item.codeId
          console.warn("Country: " + result[length - 1].Country)
        }
      })
    }
    return code
  } catch (error) {
    return code
  }
}



interface uuidsType {
  /** 轨迹附件UUID */
	Trajectory?: string,
	/** 图片附件UUID，多个文件时以逗号间隔 */
	Photo?: string,
	/** 视频附件UUID，多个文件时以逗号间隔 */
	VideoFile?: string,
	/** 声音附件UUID，多个文件时以逗号间隔 */
	SoundFile?: string,
}
type uploadType = "marker" | "line" | "media" | "all"
/**
 * 上传信息
 * @param uuidInfo 附件的uuid的信息对象
 * @param id 记录的id
 * @param type 数据集的类型
 * @returns
 */
const sendMessagePhone = async (uuidInfo: uuidsType, id: number, type: uploadType) => {
  try {

    let layerpath = "marker_118081@langchao"
    switch(type) {
      case "line":
        layerpath = "line_965018@langchao"
        break
      case "marker":
        layerpath = "marker_118081@langchao"
        break
      case "media":
        layerpath = "marker_322@langchao"
        break
      default:
        break
    }

    const result = await LayerUtils.getLayerAttribute(
      {
        data: [],
        head: [],
      },
      layerpath, 0, 30,
      {
        // filter: this.filter,
      },
      "refresh",
    )
    const layerAttributedataArray = result.attributes.data
    // const columnIndex = result.total !== 0 ? 0 : result.total
    let columnIndex = layerAttributedataArray.length - 1
    const layerAttributedataLength = layerAttributedataArray.length
    for(let i = 0; i < layerAttributedataLength; i ++) {
      const AttributedataItem = layerAttributedataArray[columnIndex]
      for(let j = 0; j < AttributedataItem.length; j ++) {
        const item = AttributedataItem[j]
        if(item.name === "SmID" && item.value === id) {
          columnIndex = i
        }
      }
    }

    let myName: string | number | boolean = ''         // 呼叫人姓名
    let myPhoneNumber: string | number | boolean = ''    // 呼叫人电话
    let callName: string | number | boolean = ''         // 被呼叫人姓名
    let callPhoneNumber: string | number | boolean = ''  // 被呼叫人电话
    let localTime: string | number | boolean= ''        // 当地时间
    let bjTime: string | number | boolean = ''          // 北京时间
    let durationTime: string | number | boolean = 0

    const layerAttributedata = layerAttributedataArray[columnIndex]

    const smID = id
    let isUploadedIndex = 0

    for(let j = 0; j < layerAttributedata.length; j ++) {
      const item = layerAttributedata[j]
      if(item.name === "isUploaded") {
        isUploadedIndex = j
      }

      if(item.name === "myName") {
        myName = item.value
      } else if(item.name === "myPhoneNumber") {
        myPhoneNumber = item.value
      } else if(item.name === "callName") {
        callName = item.value
      } else if(item.name === "callPhoneNumber") {
        callPhoneNumber = item.value
      } else if(item.name === "localTime_User") {
        localTime = item.value
      } else if(item.name === "bjTime") {
        bjTime = item.value
      } else if(item.name === "duration") {
        durationTime = item.value
      }
    }
    const MesContent = `-${myName}-  -${myPhoneNumber}- 呼叫    -${callName}-  -${callPhoneNumber}-  ${localTime}   ${bjTime}   时长-${durationTime}- 分钟`

    const date = new Date()
    const timezone = 8 //目标时区时间，东八区(北京时间)   东时区正数 西市区负数
    const offset_GMT = date.getTimezoneOffset() // 本地时间和格林威治的时间差，单位为分钟
    const nowDate = date.getTime() // 本地时间距 1970 年 1 月 1 日午夜（GMT 时间）之间的毫秒数
    const targetDate = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000)
    // const beijingTime = targetDate.getTime()
    // 格式化时间
    const formDateLocal = dateFormat("yyyy-MM-dd HH:mm:ss", date)
    const formDateBeijing = dateFormat("yyyy-MM-dd HH:mm:ss", targetDate)

    const position = await SMap.getCurrentLocation()
    const countryCode = await getCountryCode(position.longitude, position.latitude)

    const params: MessageInfoType = {
      ...uuidInfo,
      UserId: "",
      UserName: "",
      LocalTime: formDateLocal,
      BeijingTime: formDateBeijing,
      CountryCode: countryCode + "",
      /** 呼叫内容 */
      MesContent: MesContent,
    }
    const isSuccessed = await message(params)


    if(isSuccessed) {
      // 上传成功 修改数据集
      const altData = [
        {
          mapName: "langchao",
          layerPath: layerpath,
          fieldInfo: [
            {
              name: 'isUploaded',
              value: false,
              index: isUploadedIndex,
              columnIndex: columnIndex,
              smID: smID,
            },
          ],
          params: {
            // index: int,      // 当前对象所在记录集中的位置
            filter: `SmID=${smID}`, // 过滤条件
            cursorType: 2, // 2: DYNAMIC, 3: STATIC
          },
        },
      ]

      await AppToolBar.getProps().setLayerAttributes(altData)

    }


    return isSuccessed
  } catch (error) {
    return false
  }
}

/**
 * 提交的线和点的记录
 * @param id 记录的id
 * @param type 数据集的类型
 */
const uploadTrack = async (id: number, type: uploadType) => {
  try {
    let layerdatasetName = "marker_118081"
    switch(type) {
      case "line":
        layerdatasetName = "line_965018"
        break
      case "marker":
        layerdatasetName = "marker_118081"
        break
      case "media":
        layerdatasetName = "marker_322"
        break
      default:
        break
    }

    const homePath = await FileTools.getHomeDirectory()
    const tempPath =
      homePath +
      ConstPath.UserPath +
      AppToolBar.getProps().user.currentUser.userName +
      '/' +
      ConstPath.RelativePath.Temp
    const path = tempPath + layerdatasetName + '_' + id + '.json'

    const ids = []
    ids.push(id)
    // 删除文件
    const jsonFileExist = await FileTools.fileIsExist(path)
    if(jsonFileExist) {
      await FileTools.deleteFile(path)
    }

    const count = await SMap.exportDatasetToGeoJsonFileByID("langchao", layerdatasetName, path, ids, false)

    const layerName = layerdatasetName + "@langchao"
    const info = await SMediaCollector.getMediaInfo(layerName, id)
    console.warn("info: " + JSON.stringify(info))
    const mediaPaths = info.mediaFilePaths
    // 遍历将上传图片路径，获取uuid
    const photoUuids = ""
    for(let i = 0; i < mediaPaths.length; i ++) {
      const itemPath = homePath + mediaPaths[i]
      let mediaUploadInfo = await uploadFile(path)
      if(mediaUploadInfo) {
        const mUUID = mediaUploadInfo.uuid
        if(photoUuids !== "") {
          photoUuids += "," + mUUID
        } else {
          photoUuids = mUUID
        }
      }
    }

    if(count > 0) {
      let uploadInfo = await uploadFile(path)
      if(uploadInfo !== null) {
        uploadInfo = JSON.parse(JSON.stringify(uploadInfo))
        const uuidF = uploadInfo.uuid
        // 图片的路径获取 图片的文件上传 图片的uuid
        const result = await sendMessagePhone({
          Trajectory: uuidF,
          Photo: photoUuids,
        }, id, 'line')

        // 删除文件
        const jsonFileExist = await FileTools.fileIsExist(path)
        if(jsonFileExist) {
          await FileTools.deleteFile(path)
        }
      }
    }
  } catch (error) {
    // to do
  }
}

/**
 * 提交时弹出的对话框，用于确认是否要提交
 * @param id 记录的id
 * @param type 数据集的类型
 */
const uploadDialog = async (id: number, type: uploadType) => {
  try {
    console.warn("enter uploadDialog")
    global.SimpleDialog.set({
      // text: getLanguage(global.language).Map_Layer.IS_ADD_NOTATION_LAYER,
      text: "是否上传该数据",
      confirmText: getLanguage(global.language).Prompt.YES,
      cancelText: getLanguage(global.language).Prompt.NO,
      confirmAction: async () => {
        global.SimpleDialog.setVisible(false)
        global.Loading.setLoading(true, "提交中...")
        switch(type) {
          case "line":
            await uploadTrack(id, 'line')
            break
          case "marker":
            await uploadTrack(id, 'marker')
            break
          case "media":
            await uploadTrack(id, 'media')
            break
          case "all":
            await sendInfoAll()
            break
        }
        global.Loading.setLoading(false)
        Toast.show("上传成功")
      },
      cancelAction: () => {
        global.SimpleDialog.setVisible(false)
      },
    })
    global.SimpleDialog.setVisible(true)
  } catch (error) {
    // to do
  }
}

/**
 * 整体提交
 */
const sendInfoAll = async() => {
  try {
    // 线的整体提交
    const datasetArrayL = await SMap.querybyAttributeValue("langchao", "line_965018", "isUploaded=0")
    const datasetArrayLengthL = datasetArrayL.length
    if(datasetArrayLengthL > 0) {
      // const ids = []
      for(let i =0; i < datasetArrayLengthL; i ++) {
        const item = JSON.parse(JSON.stringify(datasetArrayL[i]))
        // ids.push(Number(item.SmID))
        await uploadTrack(item.SmID, 'line')
      }
    }

    // 点的整体提交
    const datasetArrayM = await SMap.querybyAttributeValue("langchao", "marker_118081", "isUploaded=0")
    const datasetArrayLengthM = datasetArrayM.length
    if(datasetArrayLengthM > 0) {
      // const ids = []
      for(let i =0; i < datasetArrayLengthM; i ++) {
        const item = JSON.parse(JSON.stringify(datasetArrayM[i]))
        // ids.push(Number(item.SmID))
        await uploadTrack(item.SmID, 'marker')
      }
    }

    // 多媒体的整体提交 to do

  } catch (error) {
    // to do
  }
}



export default {
  tour,
  positionUpload,
  dateFormat,
  getCountryCode,
  sendInfoAll,
  uploadDialog,
  uploadTrack,
}

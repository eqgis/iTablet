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
import { uploadFile, MessageInfoType, message, getUserParam, printLog, uploadFileTest } from '../../utils/langchaoServer'



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
      let day: number | string = date.getDate()
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
    printLog(`\n============================ sendMessagePhone ============================`)
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
    console.warn("01: " + JSON.stringify(result))
    printLog("\n01: " + JSON.stringify(result))
    const layerAttributedataArray = result.attributes.data
    // const columnIndex = result.total !== 0 ? 0 : result.total
    let columnIndex = 0
    const layerAttributedataLength = layerAttributedataArray.length
    for(let i = 0; i < layerAttributedataLength; i ++) {
      const AttributedataItem = layerAttributedataArray[i]
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

    console.warn("02: " + JSON.stringify(columnIndex))
    printLog("\n02: " + JSON.stringify(columnIndex))
    const layerAttributedata = layerAttributedataArray[columnIndex]
    console.warn("03: " + JSON.stringify(layerAttributedata))
    printLog("\n03: " + JSON.stringify(layerAttributedata))

    const smID = id
    let isUploadedIndex = 0

    for(let j = 0; j < layerAttributedata.length; j ++) {
      const item = layerAttributedata[j]
      console.warn("item name: " + item.name + " - item value: " + item.value)
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
    console.warn("04 MesContent: " + MesContent)
    printLog("\n04 MesContent: " + MesContent)

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
    console.warn("05 countryCode: " + countryCode + " - position: " + JSON.stringify(position))
    printLog("\n05 countryCode: " + countryCode + " - position: " + JSON.stringify(position))

    let infos = getUserParam()
    const name = infos.username !== "" ? infos.username : '张三'
    const userid = infos.userId !== "" ? infos.userId : "zhangsan"
    console.warn("06 userinfo: " + JSON.stringify(infos))
    printLog("\n06 userinfo: " + JSON.stringify(infos))

    const params: MessageInfoType = {
      ...uuidInfo,
      UserId: userid,
      UserName: name,
      LocalTime: formDateLocal,
      BeijingTime: formDateBeijing,
      CountryCode: countryCode + "",
      /** 呼叫内容 */
      MesContent: MesContent,
    }
    console.warn("07 MessageInfo: " + JSON.stringify(params))
    printLog("\n07 MessageInfo: " + JSON.stringify(params))
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
    printLog(`\nsendMessagePhone error: ${JSON.stringify(error)}`)
    global.SimpleDialog.setVisible(false)
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
    printLog(`\n============================ uploadTrack ============================`)
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

    /////////////////////////////////////////////////
    // const PathTemp = homePath +
    // ConstPath.UserPath +
    // AppToolBar.getProps().user.currentUser.userName +
    // '/' +
    // ConstPath.RelativePath.ARSymbol + "arnavi_arrow.png"
    // uploadFileTest(PathTemp, 'image/foo')
    // uploadFileTest(path, 'image/foo')
    /////////////////////////////////////////////////

    const layerName = layerdatasetName + "@langchao"
    const info = await SMediaCollector.getMediaInfo(layerName, id)
    console.warn("info: " + JSON.stringify(info))
    printLog(`\n mediainfo： ${JSON.stringify(info)}`)
    const mediaPaths = info?.mediaFilePaths || []
    // 遍历将上传图片路径，获取uuid
    const photoUuids = ""
    printLog(`\n mediaPaths： ${JSON.stringify(mediaPaths)}`)
    for(let i = 0; i < mediaPaths.length; i ++) {
      const itemPath = homePath + mediaPaths[i]
      console.warn("imagePAth: " + itemPath)
      printLog(`\n imagePath ${itemPath}`)
      // uploadFileTest(itemPath)
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

    printLog(`\n photoUuids ${photoUuids}`)

    // const result = await sendMessagePhone({
    //   Trajectory: "1111111",
    //   Photo: photoUuids,
    // }, id, 'line')
    // console.warn("message result: " + result)

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
    printLog(`uploadTrack error: ${JSON.stringify(error)}`)
    global.SimpleDialog.setVisible(false)
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
        global.Loading.setLoading(true, getLanguage(global.language).Prompt.RESOURCE_UPLOADING)
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
        Toast.show(getLanguage(global.language).Prompt.RESOURCE_UPLOAD_SUCCESS)
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

    console.warn("enter send all ")
    // 线的整体提交
    const datasetArrayL = await SMap.querybyAttributeValue("langchao", "line_965018", "isUploaded=0")
    const datasetArrayLengthL = datasetArrayL.length
    if(datasetArrayLengthL > 0) {
      // const ids = []
      for(let i =0; i < datasetArrayLengthL; i ++) {
        const item = JSON.parse(JSON.stringify(datasetArrayL[i]))
        // ids.push(Number(item.SmID))
        await uploadTrack(Number(item.SmID), 'line')
      }
    }

    // 多媒体的整体提交 to do
    const datasetArrayM = await SMap.querybyAttributeValue("langchao", "marker_322", "isUploaded=0")
    const datasetArrayLengthM = datasetArrayM.length
    if(datasetArrayLengthM > 0) {
      // const ids = []
      for(let i =0; i < datasetArrayLengthM; i ++) {
        const item = JSON.parse(JSON.stringify(datasetArrayM[i]))
        // ids.push(Number(item.SmID))
        await uploadTrack(Number(item.SmID), 'media')
      }
    }

  } catch (error) {
    // to do
  }
}



export default {
  dateFormat,
  getCountryCode,
  sendInfoAll,
  uploadDialog,
  uploadTrack,
}

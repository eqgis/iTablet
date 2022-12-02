// import React from 'react'
import { SCollector, SMap, SMediaCollector, SMCollectorType } from 'imobile_for_reactnative'
import { FileTools } from '@/native'
import { ConstPath } from '@/constants'
import { AppToolBar, Toast } from '@/utils'
import { getLanguage } from '@/language'
import { ImagePicker } from '@/components'
import ToolbarModule from '@/containers/workspace/components/ToolBar/modules/ToolbarModule'
import { MediaData } from 'imobile_for_reactnative/types/interface/collector/SMediaCollector'
import { SuperMapKnown } from '@/containers/tabs'
import { collectionModule } from '@/containers/workspace/components/ToolBar/modules'
import { getJson } from './data'

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
    console.warn("Country: " + result.Country)
    if(result && result.Country) {
      const countrycodeData = getJson().contryCode
      countrycodeData.map((item: countryCodeType) => {
        if(item.name === result.Country) {
          code = item.codeId
        }
      })
    }
    return code
  } catch (error) {
    return code
  }
}



export default {
  tour,
  positionUpload,
  dateFormat,
  getCountryCode,
}
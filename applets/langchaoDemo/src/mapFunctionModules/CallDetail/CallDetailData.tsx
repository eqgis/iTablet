import React from 'react'
import ToolbarBtnType from "@/containers/workspace/components/ToolBar/ToolbarBtnType"
import { ToolBarBottomItem } from "imobile_for_reactnative/components/ToolbarKit"
import { dp } from "imobile_for_reactnative/utils/size"
import { Image, Text, TouchableOpacity, View } from "react-native"
import CallDetailPage, { callAttributeType } from "../../components/CallDetailPage/CallDetailPage"
import { AppletsToolType } from "../../constants"
import { getPublicAssets, getThemeAssets } from '@/assets'
import NavigationService from '@/containers/NavigationService'
import { SMap } from 'imobile_for_reactnative'
import ToolbarModule from '@/containers/workspace/components/ToolBar/modules/ToolbarModule'
import { Header } from '@/components'
import { color } from '@/styles'
import { getImage } from '../../assets/Image'
import { AppEvent } from '@/utils'
import { getLanguage } from '@/language'

interface DataItem {
  key: string;
  title: string;
  action: (type?: any) => (Promise<boolean | void> | void);
  size: string;
  image: any;
  selectMode?: string,
  disable?: boolean,
}

/**
 * 获取编辑操作
 * @param type
 * @returns {{data: Array, buttons: Array}}
 */
function getData(type: string | number) {
  const data: DataItem[] = []
  const buttons: ToolBarBottomItem[] = []
  let customView = null


  switch(type) {
    case AppletsToolType.APPLETS_CALL_DETAIL_HOME:
      customView = (_data: callAttributeType) => (
        <CallDetailPage
          data={_data}
        />
      )
      // buttons = [
      //   {
      //     type: ToolbarBtnType.CANCEL,
      //     image: getThemeAssets().toolbar.icon_toolbar_quit,
      //     action: async () => {
      //       await SMap.clearTrackingLayer()
      //       NavigationService.navigate('HistoricalRecord')
      //       global.ToolBar?.close()
      //     },
      //   },
      // ]
      break
  }
  return { data, buttons, customView }
}

/** 自定义Header数据 */
function getHeaderData(type: string | number) {
  const headerData = null
  return headerData
}


function getHeaderView(type: string | number) {
  let customHeadView = null
  switch(type) {
    case AppletsToolType.APPLETS_CALL_DETAIL_HOME:
      // customHeadView = (
      //   <Header
      //     // ref={ref => (this.containerHeader = ref)}
      //     backAction={async () => {
      //       await SMap.clearTrackingLayer()
      //       NavigationService.navigate('HistoricalRecord')
      //       global.ToolBar?.close()
      //     }}
      //     withoutBack={false}
      //     // title={"呼叫详情"}
      //     type={'fix'}
      //     headerRight={[]}
      //     headerRightStyle={[]}
      //     // headerLeft={[]}
      //     headerTitleViewStyle={[{
      //       fontSize: dp(16),
      //       textAlign: 'left',
      //       backgroundColor: '#f00',
      //     }]}
      //   />
      // )
      customHeadView = (
        <View
          style={[{
            width: '100%',
            height: dp(60),
            backgroundColor: '#fff',
            flexDirection: 'row',
            // alignContent: 'center',
            alignItems: 'center',
            borderBottomColor: color.colorEF,
            borderBottomWidth: dp(1),
            paddingHorizontal: dp(10),
          }]}
        >
          <TouchableOpacity
            style={[{
              width: dp(40),
              height: dp(40),
              justifyContent: 'center',
              alignItems: 'center',
              // backgroundColor: '#f00',
            }]}
            onPress={async () => {
              await SMap.clearTrackingLayer()
              NavigationService.navigate('HistoricalRecord')
              global.ToolBar?.close()
            }}
          >
            <Image
              style={[{
                width: dp(40),
                height: dp(40),
              }]}
              source={getPublicAssets().common.icon_back}
            />
          </TouchableOpacity>
          <View
            style={[{
              flex:1,
              height: dp(40),
              justifyContent: 'center',
              alignItems: 'center',
            }]}
          >
            <Text
              style={[{
                fontSize: dp(22),
              }]}
            >{getLanguage(global.language).Map_Settings.CALL_DETAIL}</Text>
          </View>
          <TouchableOpacity
            style={[{
              width: dp(40),
              height: dp(40),
              justifyContent: 'center',
              alignItems: 'center',
              // backgroundColor: '#f00',
            }]}
            onPress={async () => {
              // TourAction.uploadDialog(item.SmID, 'line')
              AppEvent.emitEvent('uploadData')
            }}
          >
            <Image
              style={[{
                width: dp(33),
                height: dp(33),
              }]}
              source={getImage().icon_upload}
            />
          </TouchableOpacity>
        </View>
      )
      break
  }
  return customHeadView
}

export default {
  getData,
  getHeaderData,
  getHeaderView,
}

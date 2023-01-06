import React from 'react'
import ToolbarBtnType from "@/containers/workspace/components/ToolBar/ToolbarBtnType"
import { ToolBarBottomItem } from "imobile_for_reactnative/components/ToolbarKit"
import { dp } from "imobile_for_reactnative/utils/size"
import { Text, View } from "react-native"
import CallDetailPage, { callAttributeType } from "../../components/CallDetailPage/CallDetailPage"
import { AppletsToolType } from "../../constants"
import { getThemeAssets } from '@/assets'
import NavigationService from '@/containers/NavigationService'
import { SMap } from 'imobile_for_reactnative'
import ToolbarModule from '@/containers/workspace/components/ToolBar/modules/ToolbarModule'
import { Header } from '@/components'

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
  let buttons: ToolBarBottomItem[] = []
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
      customHeadView = (
        <Header
          // ref={ref => (this.containerHeader = ref)}
          backAction={async () => {
            await SMap.clearTrackingLayer()
            NavigationService.navigate('HistoricalRecord')
            global.ToolBar?.close()
          }}
          withoutBack={false}
          // title={"呼叫详情"}
          type={'fix'}
          headerRight={[]}
          headerRightStyle={[]}
          // headerLeft={[]}
          headerTitleViewStyle={[{
            fontSize: dp(16),
            textAlign: 'left',
            backgroundColor: '#f00',
          }]}
        />
      )
      // customHeadView = (
      //   <View
      //     style={[{
      //       width: '100%',
      //       height: dp(60),
      //       backgroundColor: '#fff',
      //     }]}
      //   >
      //     {_headerLeft()}
      //   </View>
      // )
      break
  }
  return customHeadView
}

export default {
  getData,
  getHeaderData,
  getHeaderView,
}

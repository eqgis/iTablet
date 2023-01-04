import React from 'react'
import ToolbarBtnType from "@/containers/workspace/components/ToolBar/ToolbarBtnType"
import { ToolBarBottomItem } from "imobile_for_reactnative/components/ToolbarKit"
import { dp } from "imobile_for_reactnative/utils/size"
import { ImageSourcePropType, Text, View } from "react-native"
import ChangeBaseLayer from "../../components/ChangeBaseLayer/ChangeBaselayer"
import { AppletsToolType } from "../../constants"
import { getThemeAssets } from '@/assets'
import NavigationService from '@/containers/NavigationService'
import { SMap } from 'imobile_for_reactnative'
import ToolbarModule from '@/containers/workspace/components/ToolBar/modules/ToolbarModule'

interface DataItem {
  key: string;
  title: string;
  action: (type?: any) => (Promise<boolean | void> | void);
  size: string;
  image: any;
  selectMode?: string,
  disable?: boolean,
}

export interface layerManagerDataType {
	title: string,
	action: () => unknown,
	data: Array<unknown>,
	image: ImageSourcePropType, // 图片
	type: string,
	themeType: number,
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
    case AppletsToolType.APPLETS_CHANGE_BASE_LAYER_HOME:
      customView = (layerManagerDataArr: Array<layerManagerDataType>) => (
        <ChangeBaseLayer
          data={layerManagerDataArr}
        />
      )
      break
  }
  return { data, buttons, customView }
}

export default {
  getData,
}

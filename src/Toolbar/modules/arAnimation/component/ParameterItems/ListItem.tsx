import React, { useState } from 'react'
import { Text, TouchableOpacity, View, ScaledSize, ImageRequireSource, Image, ScrollView } from 'react-native'
import { LANDSCAPE_WIDTH } from '../../../../../SMToolbar/component/styles'
import { AppStyle, dp } from '../../../../../utils'

interface ListItemProps {
  data: ListItemData[]
  selectKey: string
  windowSize: ScaledSize
}

export interface ListItemData {
  image: ImageRequireSource
  text: string
  key: string
  onPress: () => void
  disable: boolean
}

/** 动画类型list */
export const ListItem = (props: ListItemProps): JSX.Element => {

  const isPortrait = props.windowSize.height > props.windowSize.width

  const width = isPortrait ? props.windowSize.width : LANDSCAPE_WIDTH

  const [selectKey, setSelectKey] = useState(props.selectKey)

  const renderItem = (item: ListItemData, index: number) => {
    const isSelected = selectKey === item.key
    const isDisabled = item.disable
    return (
      <TouchableOpacity
        key={item.key + '_' + index}
        disabled={isDisabled}
        onPress={() => {
          item.onPress()
          setSelectKey(item.key)
        }}
        style={{
          alignItems: 'center',
          width: width / props.data.length
        }}
      >
        <Image
          source={item.image}
          style={[AppStyle.Image_Style, (!isSelected && isDisabled) && {tintColor: AppStyle.Color.LIGHT_GRAY}]}
        />
        <Text style={[AppStyle.h3,  (!isSelected && isDisabled) && {color: AppStyle.Color.LIGHT_GRAY}]}>
          {item.text}
        </Text>
        {isSelected  && <View style={{height: dp(2), width: dp(40), backgroundColor: AppStyle.Color.BLACK}}/>}
      </TouchableOpacity>
    )
  }

  return (
    <ScrollView
      contentContainerStyle={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: dp(2),
      }}
      horizontal={true}
      showsHorizontalScrollIndicator={false}>
      {props.data.map((item, index)=>renderItem(item, index))}
    </ScrollView>
  )
}


import React from 'react'
import { Text, View} from 'react-native'
import { SwitchItem } from '../../../../../components'
import { AppStyle, dp } from '../../../../../utils'


interface BoolItemProps {
  name: string
  value: boolean
  onValueChange: (value: boolean) => void
}

export const BoolItem = (props: BoolItemProps) : JSX.Element => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: dp(30),
      }}
    >
      <Text style={AppStyle.h3g}>
        {props.name}
      </Text>
      <SwitchItem
        text={props.name}
        value={props.value}
        onPress={props.onValueChange}
        style={{
          height: dp(30),
        }}
      />
    </View>
  )
}


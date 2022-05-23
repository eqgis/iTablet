import React, { useState } from 'react'
import { Text, TouchableOpacity, View, Image } from 'react-native'
import { getImage } from '../../../../../assets'
import { AppInputDialog, AppStyle, CheckSpell, dp, FloatMath } from '../../../../../utils'


interface CounterItemProps {
  name: string
  value: number
  numberType: 'float' | 'int'
  onValueChange: (value: number) => void
}

export const CounterItem = (props: CounterItemProps): JSX.Element => {
  let defaultValue = props.value
  if(props.numberType === 'float') {
    defaultValue = parseFloat(props.value.toFixed(2))
  }

  const [value, setValue] = useState(defaultValue)

  const changeValue = (value: number) => {
    setValue(value)
    props.onValueChange(value)
  }

  const inputValue = () => {
    AppInputDialog.show({
      defaultValue: value + '',
      keyboardType: 'numeric',
      checkSpell: props.numberType === 'float' ? CheckSpell.checkFloat('positive') : CheckSpell.checkInteger('positive'),
      confirm: (text) => {
        let result: number
        if(props.numberType === 'float') {
          result = parseFloat(text)
        } else {
          result = parseInt(text)
        }
        setValue(result)
        props.onValueChange(result)
      },
    })
  }

  return (
    <View
      style={{
        marginHorizontal: dp(30),
        height: dp(33),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: AppStyle.Color.LIGHT_GRAY
      }}
    >
      <Text style={AppStyle.h3g}>
        {props.name}
      </Text>

      <View
        style={{
          flexDirection: 'row',

        }}
      >
        <TouchableOpacity
          onPress={() => {
            if(value >= 1) {
              changeValue(FloatMath.subtract(value, 1))
            }
          }}
        >
          <Image
            source={getImage().icon_narrow}
            style={{width: dp(15), height: dp(15)}}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={inputValue}
          style={{
            width: dp(56),
            height: dp(19),
            borderWidth: dp(1),
            borderRadius: dp(4),
            borderColor: AppStyle.Color.LIGHT_GRAY,
            marginHorizontal: dp(10),
          }}
        >
          <Text style={AppStyle.h3c} numberOfLines={1}>
            {value}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            changeValue(FloatMath.add(value, 1))
          }}
        >
          <Image
            source={getImage().icon_enlarge}
            style={{width: dp(15), height: dp(15)}}
          />
        </TouchableOpacity>
      </View>

    </View>
  )

}


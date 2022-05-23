import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { AppStyle, dp } from '../../../../../utils'
import { Picker } from '@react-native-picker/picker'

interface ItemSelectProps<T> {
  name: string
  data: {label: string, value:T}[]
  mode: 'list' | 'flat'
  defalutValue?: T
  onValueChange: (value: T) => void
  disabled?: boolean
}

/**
 * select Item
 * @param props
 * @returns
 */
export function SelectItem<T>(props: ItemSelectProps<T>) {
  const [value, setValue] = useState<null | T>(props.defalutValue !== undefined ? props.defalutValue : null)

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: dp(30),
        flexWrap: 'wrap'
      }}
    >
      {props.mode === 'flat'
        ? (
          <>
            {props.data.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setValue(item.value)
                    props.onValueChange(item.value)
                  }}
                  style={[{
                    borderWidth: 1,
                    minWidth: dp(88),
                    height: dp(28),
                    justifyContent: 'center',
                    alignContent: 'center',
                    borderRadius: dp(12),
                    marginVertical: dp(3)
                  },
                  value !== item.value && { borderColor: AppStyle.Color.LIGHT_GRAY}
                  ]}
                >
                  <Text
                    style={[
                      { textAlign: 'center', marginHorizontal: dp(7)},
                      value === item.value ? AppStyle.h3 : AppStyle.h3g,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </>
        )
        : (
          <>
            <Text style={AppStyle.h3g}>
              {props.name}
            </Text>
            <Picker
              selectedValue={value}
              mode={'dropdown'}
              style={{ width: dp(200), height: dp(30) }}
              onValueChange={value => {
                setValue(value)
                value !== null && props.onValueChange(value)
              } }
            >
              {props.data.map((item, index) => {
                return <Picker.Item label={item.label} value={item.value} key={item.label + index} />
              })}

            </Picker>
          </>
        )
      }
    </View>
  )
}

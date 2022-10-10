import React, { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View, Platform } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
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
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setValue(props.defalutValue !== undefined ? props.defalutValue : null)
  }, [props.defalutValue])

  const wrapSetValue: React.Dispatch<React.SetStateAction<null | T>> = (a) => {
    if(typeof a === 'function') {
      const newValue = (a as (prevT: T | null) => T | null)(value)
      newValue && props.onValueChange(newValue)
    } else {
      const newValue = a as T | null
      newValue && props.onValueChange(newValue)
    }
    setValue(a)
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: dp(30),
        flexWrap: 'wrap',
        zIndex: 100,
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
        : (Platform.OS === 'android' ? (
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
        ) : (
          <View style={{height: dp(50),flex: 1, flexDirection: 'row',  justifyContent: 'space-between',  alignItems: 'center'}}>
            <Text style={AppStyle.h3g}>
              {props.name}
            </Text>
            <View style={{ width: dp(200), height: dp(50)}}>
              <DropDownPicker
                items={props.data as any} //todo
                open={open}
                setOpen={setOpen}
                value={value as any}
                listItemContainerStyle={{
                  justifyContent: 'flex-start',
                  width: '100%',
                  backgroundColor: '#fff',
                  opacity: 1,
                }}
                setValue={wrapSetValue}
                listMode={'FLATLIST'}
              />
            </View>
          </View>
        ))
      }
    </View>
  )
}


import React, { useState } from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { AppInputDialog, AppStyle, CheckSpell, dp } from '../../../../../utils'



interface InputItemProps<T> {
  name: string
  value: T
  numberType?: 'int' | 'float'
  onValueChange: (value: T) => void
}

/**
 * Input Item
 * @param props
 * @returns
 */
export const InputItem = <T,>(props: InputItemProps<T>) : JSX.Element => {
  let defaultValue = props.value
  if(typeof defaultValue === 'number' && props.numberType === 'float') {
    defaultValue = parseFloat(defaultValue.toFixed(2)) as typeof defaultValue
  }

  const [valueText, setValueText] = useState<string>(defaultValue + '')

  const changeString = () => {
    if(typeof props.value === 'string') {
      AppInputDialog.show({
        defaultValue: valueText,
        // checkSpell
        confirm: (text) => {
          setValueText(text)
          props.onValueChange(text as typeof props.value)
        }
      })
    } else if(typeof props.value === 'number'){
      AppInputDialog.show({
        defaultValue: valueText,
        keyboardType: 'numeric',
        checkSpell: props.numberType === 'float' ? CheckSpell.checkFloat() : CheckSpell.checkInteger(),
        confirm: (text) => {
          let result: number
          if(props.numberType === 'float') {
            result = parseFloat(text)
          } else {
            result = parseInt(text)
          }
          setValueText(result + '')
          props.onValueChange(result as typeof props.value)
        },
      })
    }
  }

  return (
    <Item
      name={props.name}
      value={valueText}
      onPress={changeString}
    />
  )
}



interface ItemProps<T> {
  name: string
  value: T
  onPress?: (value: T) => void
}
/**
 * Item base
 * @param props
 * @returns
 */
const Item  = <T,>(props: ItemProps<T>) : JSX.Element => {
  return (
    <TouchableOpacity
      disabled={props.onPress === undefined}
      onPress={() => {
        props.onPress?.(props.value)
      }}
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: dp(30),
        height: dp(30),
      }}
    >
      <Text style={AppStyle.h3g}>
        {props.name}
      </Text>
      <Text
        style={[
          AppStyle.h3,
          props.onPress !== undefined && {borderBottomColor: 'black', borderBottomWidth: 1, paddingHorizontal: dp(10)}
        ]}
      >
        {props.value}
      </Text>
    </TouchableOpacity>
  )
}

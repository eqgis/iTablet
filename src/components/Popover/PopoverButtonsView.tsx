import { color, size } from '@/styles'
import { scaleSize } from '@/utils'
import React, { SetStateAction, useEffect, useImperativeHandle, useState } from 'react'
import { forwardRef } from 'react'
import { TouchableOpacity, View, Text, ViewStyle, StyleProp, TextStyle } from 'react-native'
import Popover, { Rect } from 'react-native-popover-view'

interface PopoverButtonProps {
  backgroundStyle?: StyleProp<ViewStyle>,
  popoverStyle?: StyleProp<ViewStyle>,
  buttonStyle?: StyleProp<ViewStyle>,
  textStyle?: StyleProp<TextStyle>,
  onRequestClose?: () => void,
  data?: ButtonProps[]
}

interface ButtonProps {
  title: string,
  onPress: () => void,
}

interface ButtonProps {
  buttonStyle?: StyleProp<ViewStyle>,
  textStyle?: StyleProp<TextStyle>,
  title: string,
  onPress: () => void,
}

function PopoverButtonsView(props: PopoverButtonProps, ref: typeof PopoverButtonsView) {
  const [showPopover, setShowPopover] = useState(false)
  const [from, setFrom] = useState(new Rect(1, 1, 200, 60))
  const [data, setData] = useState(props.data || [])

  useImperativeHandle(ref, () => ({  
    setVisible: async (isShowPopover: boolean, rect?: SetStateAction<Rect>, data?: ButtonProps[], cb?:(() => void) | null) => {
      setShowPopover(isShowPopover)
      rect && setFrom(rect)
      data && setData(data)
      cb?.()
    }
  }))

  function _onRequestClose() {
    setShowPopover(false)
    props.onRequestClose?.()
  }

  function _renderButtons() {
    const buttons: React.ReactNode[] = []
    data.forEach((item, index) => {
      buttons.push(<PopoverButton key={index} {...item}/>)
    })
    return (
      <View
        style={{flexDirection: 'row'}}
      >
        {buttons}
      </View>
    )
  }

  return (
    <Popover
      backgroundStyle={props.backgroundStyle ? props.backgroundStyle : {backgroundColor: 'rgba(0, 0, 0, 0)'}}
      popoverStyle={props.popoverStyle ? props.popoverStyle : {backgroundColor: 'rgba(0, 0, 0, 1)'}}
      isVisible={showPopover}
      animationConfig={{
        duration: 100,
      }}
      from={from}
      onRequestClose={_onRequestClose}>
      {_renderButtons()}
    </Popover>
  )
}

function PopoverButton(props: ButtonProps) {

  function _onPress() {
    props.onPress?.()
  }

  return (
    <TouchableOpacity
      style={[
        {
          height: scaleSize(60),
          // width: scaleSize(100),
          paddingHorizontal: scaleSize(8),
          backgroundColor: color.black,
          justifyContent: 'center',
          alignItems: 'center',
        },
        props.buttonStyle,
      ]}
      onPress={_onPress}
    >
      <Text
        style={[
          {
            fontSize: size.fontSize.fontSizeMd,
            color: color.itemColorWhite,
          },
          props.textStyle,
        ]}
      >
        {props.title}
      </Text>
    </TouchableOpacity>
  )
}

export default forwardRef(PopoverButtonsView)
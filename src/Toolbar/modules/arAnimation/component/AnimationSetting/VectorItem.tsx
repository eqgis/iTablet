import { Vector3 } from 'imobile_for_reactnative/types/data'
import React, { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View, Image, ImageRequireSource} from 'react-native'
import { getImage } from '../../../../../assets'
import { AppInputDialog, AppStyle, CheckSpell, dp } from '../../../../../utils'


interface VectorItemProps {
  name?: string
  value: Vector3
  onValueChange: (value: Vector3) => void
}

export const VectorItem = (props: VectorItemProps): JSX.Element => {

  const [valueX, setX] = useState(parseFloat(props.value.x.toFixed(2)))
  const [valueY, setY] = useState(parseFloat(props.value.y.toFixed(2)))
  const [valueZ, setZ] = useState(parseFloat(props.value.z.toFixed(2)))

  useEffect(() => {
    setX(parseFloat(props.value.x.toFixed(2)))
  }, [props.value.x])

  useEffect(() => {
    setY(parseFloat(props.value.y.toFixed(2)))
  }, [props.value.y])

  useEffect(() => {
    setZ(parseFloat(props.value.z.toFixed(2)))
  }, [props.value.z])

  const renderAxis = (label: string, image: ImageRequireSource, value: number, onValueChange:(value: number) => void) => {
    return (
      <View style={{
        alignItems: 'center',
      }}>
        <Image
          source={image}
          style={AppStyle.Image_Style}
        />
        <Text>
          {`${label}`}
        </Text>
        <TouchableOpacity
          onPress={() => {
            AppInputDialog.show({
              defaultValue: value + '',
              checkSpell: CheckSpell.checkFloat(),
              keyboardType: 'numeric',
              confirm: (text) => {
                const result = parseFloat(text)
                onValueChange(result)
              }
            })
          }}
          style={{marginVertical: dp(3)}}
        >
          <Text style={{width: dp(30), textAlign: 'center', borderBottomWidth: 1, borderBottomColor: AppStyle.Color.GRAY}}>
            {value}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View
      style={{
        paddingHorizontal: dp(30),
        paddingTop: dp(5),
      }}
    >
      {props.name && (
        <Text style={AppStyle.h3g}>
          {props.name}
        </Text>
      )}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: dp(5),
        }}
      >
        {renderAxis('x', getImage().translation_x, valueX, value => {
          setX(value)
          props.onValueChange({x: value, y: valueY, z: valueZ})
        })}

        {renderAxis('y', getImage().translation_y, valueY, value => {
          setY(value)
          props.onValueChange({x: valueX, y: value, z: valueZ})
        })}

        {renderAxis('z', getImage().translation_z, valueZ, value => {
          setZ(value)
          props.onValueChange({x: valueX, y: valueY, z: value})
        })}
      </View>
    </View>
  )
}


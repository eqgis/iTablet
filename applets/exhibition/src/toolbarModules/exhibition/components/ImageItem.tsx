import { dp } from "@/utils"
import React, { Component } from "react"
import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from "react-native"

export interface ImageItemData {
  key: string,
  name: string,
  image: ImageSourcePropType,
  path?: string,
}

interface Props {
  data: ImageItemData,
  isSelected?: boolean,
  action: (data: ImageItemData) => void,
}

export default class ImageItem extends Component<Props, unknown> {
  constructor(props: Props) {
    super(props)
  }

  render(): React.ReactNode {
    return (
      <TouchableOpacity
        style={[
          {
            width: dp(100),
            height: dp(100),
            marginHorizontal: dp(5),
            backgroundColor: 'rgba(0, 0, 0, .5)',
            borderRadius: dp(8),
            overflow: 'hidden',
            // opacity: 0.9,
            justifyContent: 'space-between',
            alignItems: 'center',
          },
          // this.props.isSelected && {
          //   shadowOffset: { width: 1, height: 1 },
          //   shadowColor: 'black',
          //   shadowOpacity: 1,
          //   width: dp(112),
          //   height: dp(112),
          // },
        ]}
        onPress={() => this.props.action(this.props.data)}
      >
        <Image
          source={this.props.data.image}
          style={[
            {width: dp(80), height: dp(80),marginTop: dp(10)},
            // this.props.isSelected && {
            //   width: dp(90),
            //   height: dp(90),
            // }
          ]}
        />
        <View style={[
          { position:'absolute', bottom: 0, left: 0 ,backgroundColor: '#000',opacity: 0.7 , width: '100%', height: dp(20), justifyContent: 'center', alignItems: 'center'},
          this.props.isSelected && {
            backgroundColor:"#f24f02",
            opacity: 1,
            // height: dp(23)
          },
        ]} >
          <Text style={[
            {fontSize:dp(12), color: '#fff'},
            this.props.isSelected && {
              color:"#fff",
            },

          ]}>{this.props.data.name}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { scaleSize ,setSpText} from '../../../../utils'
import { getThemeAssets } from '../../../../assets'

interface Props {
  item: any
  text: string
  onPress: () => void
  onSelectPress?: () => void
  isSelected: boolean
}

class LocalDataItem extends React.Component<Props> {
  constructor(props: Props) {
    super(props)
  }


  renderRight = () => {
      const icon = this.props.isSelected
        ? getThemeAssets().publicAssets.icon_check_in
        : getThemeAssets().publicAssets.icon_check
      return (
        <TouchableOpacity
          style={{
            paddingTop: scaleSize(20),
            paddingBottom: scaleSize(20),
          }}
          onPress={()=>{
            this.props.onSelectPress && this.props.onSelectPress(this.props.item)
          }}
        >
          <Image
            source={icon}
            style={{
              width: scaleSize(40),
              height: scaleSize(40)
            }}
          />
        </TouchableOpacity>
      )
  }

  render() {
    return(
      <TouchableOpacity
        style={[{
          height: scaleSize(80),
          marginLeft: scaleSize(20),
          paddingRight: scaleSize(20),
          borderBottomColor: '#ECECEC',
          borderBottomWidth: scaleSize(1),
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }]}
        onPress={()=>{
          this.props.onSelectPress && this.props.onSelectPress(this.props.item)
        }}
      >
        <View style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <View
            style={{
              flex: 1,
              marginLeft: scaleSize(5),
            }}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: setSpText(26),
                color: 'black',
              }}
            >
              {this.props.text}
            </Text>
          </View>
        </View>
        {this.renderRight()}
      </TouchableOpacity>
    )
  }
}

export default LocalDataItem
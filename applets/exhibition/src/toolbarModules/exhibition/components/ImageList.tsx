import { dp } from 'imobile_for_reactnative/utils/size'
import React from 'react'
import { Animated, FlatList, Image, ImageSourcePropType, ListRenderItemInfo, StyleSheet, TouchableOpacity } from 'react-native'

interface Props {
  data: ImageItem[]
}

interface State {
  vislble: boolean
}


const IMAGE_WIDTH = dp(140)

export interface ImageItem {
  image: ImageSourcePropType
  path: string
  onTouch: (path: string) => void
}

class ImageList extends React.Component<Props, State> {

  bottom = new Animated.Value(-dp(130))

  constructor(props: Props) {
    super(props)

    this.state = {
      vislble: this.props.data.length > 0
    }
  }


  componentDidUpdate(prevProps: Readonly<Props>): void {
    if(prevProps.data !== this.props.data) {
      if(this.props.data.length > 0) {
        this.showList()
      } else {
        this.hideList()
      }
    }
  }

  showList = () => {
    Animated.timing(this.bottom, {
      toValue: dp(10),
      duration: 500,
      useNativeDriver: false
    }).start()
    this.setState({vislble: true})
  }

  hideList = () => {
    Animated.timing(this.bottom, {
      toValue: -dp(130),
      duration: 300,
      useNativeDriver: false
    }).start()
    this.setState({vislble: false})

  }


  getItemWidth = () => {
    return dp(IMAGE_WIDTH + 20)
  }

  getListWidth = () => {
    if(this.props.data.length > 4) {
      return '80%'
    } else {
      return this.props.data.length * this.getItemWidth()
    }
  }

  renderItem = (param: ListRenderItemInfo<ImageItem>) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          param.item.onTouch(param.item.path)
        }}
      >
        <Image
          source={param.item.image}
          style={{
            width: dp(IMAGE_WIDTH),
            height: dp(120),
            marginHorizontal: dp(10),
          }}
        />
      </TouchableOpacity>
    )
  }

  render() {
    return(
      <>
        {this.state.vislble && (
          <TouchableOpacity
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: 'transparent'
            }}
            activeOpacity={1}
            onPress={() => {
              this.hideList()
            } }
          />
        )}

        <Animated.View
          style={{
            position: 'absolute',
            bottom: this.bottom,
            height: dp(120),
            width: this.getListWidth(),
            alignSelf: 'center'
          }}
        >
          <FlatList
            horizontal
            data={this.props.data}
            renderItem={this.renderItem} />

        </Animated.View>
      </>

    )
  }
}

export default ImageList
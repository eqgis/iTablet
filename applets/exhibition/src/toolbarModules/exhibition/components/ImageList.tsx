import { dp } from 'imobile_for_reactnative/utils/size'
import React from 'react'
import { Animated, FlatList, Image, ImageSourcePropType, ListRenderItemInfo, StyleSheet, TouchableOpacity } from 'react-native'

interface Props {
  data: ImageItem[]
  onHide?: () => void
}

interface State {
  vislble: boolean
  touchString:string
}


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
      vislble: this.props.data.length > 0,
      touchString : '',
    }
  }


  componentDidUpdate(prevProps: Readonly<Props>): void {
    if (prevProps.data !== this.props.data) {
      if (this.props.data.length > 0) {
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
    this.setState({ vislble: true })
  }

  hideList = () => {
    Animated.timing(this.bottom, {
      toValue: -dp(130),
      duration: 300,
      useNativeDriver: false
    }).start()
    this.setState({ vislble: false })
    this.props.onHide?.()
  }


  renderItem = (param: ListRenderItemInfo<ImageItem>) => {
    // let width, height
    // if(this.props.data.length == 4){
    const width = dp(120)
    const height = dp(70)
    let mstyle = {}
    let m_style = {}
    let t_width = dp(140)
    const t_height = dp(100)

    if(param.index ===this.props.data.length-1){
      t_width = dp(145)
      m_style = {borderBottomRightRadius :dp(8),borderTopRightRadius :dp(8),paddingRight:dp(5)}
    }

    if(param.index === 0){
      t_width=dp(145)
      m_style = {borderBottomLeftRadius :dp(8),borderTopLeftRadius :dp(8),paddingLeft:dp(5)}
    }

    if(this.state.touchString === param.item.path){
      mstyle = {backgroundColor: '#F24F02A6'}
    }

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          param.item.onTouch(param.item.path)
          this.setState({touchString:param.item.path})
        }}
        style={[{
          width:t_width,
          height:t_height,
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        },m_style,mstyle]}
      >
        <Image
          source={param.item.image}
          style={[{
            width: width,
            height: height,
            borderRadius: dp(5),
          }]}
        />
      </TouchableOpacity>
    )
  }

  render() {
    // let height, backcolor
    // if(this.props.data.length == 4){
    const backcolor = '#1E1E1EA6'
    // }else{
    //   height = dp(120)
    //   backcolor = 'transparent'
    // }
    return (
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
            }}
          />
        )}

        <Animated.View
          style={{
            position: 'absolute',
            bottom: this.bottom,
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: backcolor,
            borderRadius:dp(8),
          }}
        >
          <FlatList
            horizontal
            data={this.props.data}
            renderItem={this.renderItem}
            extraData={this.state}/>

        </Animated.View>
      </>

    )
  }
}

export default ImageList
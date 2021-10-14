import React, { PureComponent } from 'react'
import { Image, Text, View, TouchableOpacity } from 'react-native'
import styles, { textHeight } from './Styles'
import NavigationService from '../../../NavigationService'
import Toast from '../../../../utils/Toast'
import { scaleSize, dataUtil } from '../../../../utils'
import { getLanguage } from '../../../../language/index'
// import { color } from '../../../../styles'
export default class RenderServiceItem extends PureComponent {
  props: {
    onItemPress: () => {},
    data: any,
    imageUrl: string,
    restTitle: string,
    itemId: string,
    isPublish: boolean,
    index: number,
    scenes: Object,
    mapInfos: Object,
    display?: string,
  }
  defaultProps: {
    imageUrl: '',
    restTitle: '地图',
    display: 'flex',
  }
  constructor(props) {
    super(props)
  }

  _navigator = () => {
    if (this.props.mapInfos.length > 0 || this.props.scenes.length > 0) {
      NavigationService.navigate('MyOnlineMap', {
        scenes: this.props.scenes,
        mapInfos: this.props.mapInfos,
      })
    } else {
      Toast.show(getLanguage(GLOBAL.language).Profile.NO_MAP_SERVICE)
    }
  }

  render() {
    let moreImg = require('../../../../assets/Mine/icon_more_gray.png')
    let imageWidth = scaleSize(40),
      imageHeight = scaleSize(40)
    return (
      <View display={this.props.display}>
        <View style={styles.itemViewStyle}>
          <TouchableOpacity
            onPress={() => {
              this._navigator()
            }}
          >
            <Image
              resizeMode={'stretch'}
              style={styles.imageStyle}
              source={{ uri: dataUtil.dealUrl(this.props.imageUrl) }}
            />
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text style={[styles.restTitleTextStyle]} numberOfLines={2}>
              {this.props.restTitle}
            </Text>
            <View style={{ flex: 1 }} />
            <Text
              numberOfLines={1}
              style={[
                styles.restTitleTextStyle,
                {
                  lineHeight: textHeight,
                  textAlign: 'right',
                  paddingRight: scaleSize(25),
                },
              ]}
            />
          </View>
          <TouchableOpacity
            onPress={event => {
              if (this.props.onItemPress) {
                this.props.onItemPress(
                  this.props.isPublish,
                  this.props.itemId,
                  this.props.restTitle,
                  this.props.index,
                  event,
                  this.props.data,
                )
              }
            }}
            style={{ width: 50, height: '100%' }}
          >
            <Image
              source={moreImg}
              style={{
                width: imageWidth,
                height: imageHeight,
                position: 'absolute',
                bottom: 2,
                right: 0,
              }}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.separateViewStyle} />
      </View>
    )
  }
}

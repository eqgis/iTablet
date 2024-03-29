/*
  Copyright © SuperMap. All rights reserved.
  Author: lu cheng dong
  E-mail: 756355668@qq.com
*/
import React, { PureComponent } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from 'react-native'
import { color, size } from '../../../styles'
import { scaleSize } from '../../../utils'
import { getPublicAssets, getThemeAssets } from '../../../assets'

const styles = StyleSheet.create({
  itemContainer: {
    width: '100%',
    height: scaleSize(162),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  item: {
    flexDirection: 'row',
    height: scaleSize(120),
    marginHorizontal: scaleSize(60),
    borderRadius: scaleSize(24),
    alignItems: 'center',
    backgroundColor: color.white,
    paddingLeft: scaleSize(38),
    paddingRight: scaleSize(16),
    // paddingVertical: scaleSize(20),
    ...Platform.select({
      android: {
        elevation: 3,
      },
      ios: {
        shadowOffset: { width: 5, height: 5 },
        shadowColor: '#eee',
        shadowOpacity: 1,
        shadowRadius: 2,
      },
    }),
  },
  rightImage: {
    flexDirection: 'row',
    width: scaleSize(44),
    height: scaleSize(44),
    alignItems: 'center',
    tintColor: color.imageColorBlack,
  },
  leftImage: {
    flexDirection: 'row',
    width: scaleSize(60),
    height: scaleSize(60),
    alignItems: 'center',
    // tintColor: color.imageColorBlack,
  },
  spot: {
    position: 'absolute',
    backgroundColor: 'red',
    height: scaleSize(15),
    width: scaleSize(15),
    borderRadius: scaleSize(15),
    right: scaleSize(0),
    top: scaleSize(-5),
  },
  content: {
    marginLeft: 15,
    flexDirection: 'column',
    flex: 1,
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
  },
  text: {
    textAlign: 'left',
    fontSize: size.fontSize.fontSizeXl,
    color: color.fontColorBlack,
    padding: 0,
    backgroundColor: 'transparent',
  },
  subText: {
    marginTop: scaleSize(8),
    textAlign: 'left',
    fontSize: size.fontSize.fontSizeMd,
    color: color.fontColorGray3,
    padding: 0,
    backgroundColor: 'transparent',
  },
})

export default class Find extends PureComponent {
  props: {
    title: string,
    subTitle: string,
    leftImagePath?: string,
    isInformSpot?: boolean,
    onClick: () => {},
    rightImagePath?: string,
  }
  
  static defaultProps = {
    isInformSpot: false,
  }

  render() {
    const { title, leftImagePath, isInformSpot, onClick, rightImagePath, subTitle } = this.props
    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity
          style={styles.item}
          onPress={onClick}
        >
          {
            leftImagePath &&
            <View>
              <Image
                style={styles.leftImage}
                resizeMode={'contain'}
                source={leftImagePath}
              />
              {isInformSpot && <View style={styles.spot}/>}
            </View>
          }
          <View style={styles.content}>
            <Text style={styles.text}>{title}</Text>
            <Text style={styles.subText}>{subTitle}</Text>
          </View>
          <Image
            style={styles.rightImage}
            resizeMode={'contain'}
            source={rightImagePath || getThemeAssets().publicAssets.icon_jump}
          />
        </TouchableOpacity>
      </View>
    )
  }
}

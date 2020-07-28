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
    paddingVertical: scaleSize(20),
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
    width: scaleSize(26),
    height: scaleSize(26),
    alignItems: 'center',
    tintColor: color.imageColorBlack,
  },
  leftImage: {
    flexDirection: 'row',
    width: scaleSize(60),
    height: scaleSize(60),
    alignItems: 'center',
    tintColor: color.imageColorBlack,
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
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  text: {
    // lineHeight: scaleSize(90),
    flex: 1,
    textAlign: 'left',
    fontSize: size.fontSize.fontSizeXl,
    color: color.fontColorBlack,
    padding: 0,
  },
})

export default class Find extends PureComponent {
  props: {
    title: string,
    leftImagePath?: string,
    isInformSpot?: boolean,
    onClick: () => {},
    rightImagePath?: string,
  }
  
  static defaultProps = {
    isInformSpot: false,
  }

  render() {
    const { title, leftImagePath, isInformSpot, onClick, rightImagePath } = this.props
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
            <Image
              style={styles.rightImage}
              resizeMode={'contain'}
              source={rightImagePath || require('../../../assets/Mine/mine_my_arrow.png')}
            />
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

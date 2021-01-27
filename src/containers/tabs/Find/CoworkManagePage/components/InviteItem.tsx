/*
  Copyright © SuperMap. All rights reserved.
  Author: lu cheng dong
  E-mail: 756355668@qq.com
*/
import React, { Component } from 'react'
import { Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native'
import { scaleSize } from '../../../../../utils'
import { getThemeAssets } from '../../../../../assets'
import { color, size } from '../../../../../styles'
import { getLanguage } from '../../../../../language'
import { Users } from '../../../../../redux/models/user'

const styles = StyleSheet.create({
  itemViewStyle: {
    flex: 1,
    height: scaleSize(200),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: color.content_white,
  },
  contentView: {
    flex: 1,
    flexDirection: 'column',
  },
  title: {
    fontSize: size.fontSize.fontSizeLg,
    color: color.fontColorBlack,
  },
  subTitle: {
    marginTop: scaleSize(6),
    fontSize: size.fontSize.fontSizeMd,
    color: color.fontColorBlack,
  },
  time: {
    marginTop: scaleSize(6),
    fontSize: size.fontSize.fontSizeSm,
    color: color.fontColorGray3,
  },

  btnView: {
    // width: scaleSize(128),
    paddingLeft: scaleSize(20),
    height: scaleSize(56),
    borderRadius: scaleSize(28),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.itemColorGray,
  },
  btnView2: {
    width: scaleSize(128),
    height: scaleSize(56),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  showBtn: {
    borderRadius: scaleSize(28),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scaleSize(10),
    height: '100%',
    // backgroundColor: 'red',
  },
  imageStyle: {
    width: scaleSize(36),
    height: scaleSize(36),
  },
  rightText: {
    fontSize: size.fontSize.fontSizeMd,
    color: color.white,
  },
  rightText2: {
    fontSize: size.fontSize.fontSizeMd,
    color: color.fontColorGray3,
  },
})

interface State {
  progress: number | string,
  isDownloading: boolean,
  selectedData: Map<string, Object>, //被选中人员数组数组
}

interface Props {
  user: Users,
  data: any,
  index: number,
  style?: any,
  onPress?: (item?: any) => void,
  showMore?: (data: {data: any, index:number, event: any}) => void,
}

export default class InviteItem extends Component<Props, State> {

  _onPress = () => {
    this.props.onPress && this.props.onPress({data: this.props.data, index: this.props.index})
  }

  _showMore = (event: any) => {
    this.props.showMore && this.props.showMore({data: this.props.data, index: this.props.index, event})
  }

  _renderRight = () => {
    let status = ''
    switch(this.props.data.feedbackStatus) {
      case 'WAITING':
        status = getLanguage(GLOBAL.language).Friends.GROUP_APPLY_AGREE
        return (
          <TouchableOpacity activeOpacity={0.8} style={styles.btnView} onPress={this._onPress}>
            {/* <Image
              style={styles.imageStyle}
              resizeMode={'contain'}
              source={getThemeAssets().cowork.icon_group_agree}
            /> */}
            <View style={styles.imageStyle} />
            <Text style={styles.rightText}>{status}</Text>
            <TouchableOpacity activeOpacity={0.8} style={styles.showBtn} onPress={this._showMore}>
              <Image
                style={styles.imageStyle}
                resizeMode={'contain'}
                source={getThemeAssets().cowork.icon_currency_open}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        )
      case 'REFUSED':
        status = getLanguage(GLOBAL.language).Friends.GROUP_APPLY_DISAGREE
        break
      case 'ACCEPTED':
        status = getLanguage(GLOBAL.language).Friends.GROUP_APPLY_ALREADY_AGREE
        break
    }
    return (
      <View style={styles.btnView2}>
        <Text style={styles.rightText2}>{status}</Text>
      </View>
    )
  }

  render() {
    return (
      <View style={[styles.itemViewStyle, this.props.style]}>
        <View style={styles.contentView}>
          <Text style={styles.title}>{this.props.data.inviterNick}</Text>
          <Text style={styles.subTitle}>{getLanguage(GLOBAL.language).Friends.INVITE_TO + ': ' + this.props.data.groupName}</Text>
          <Text style={styles.subTitle}>{getLanguage(GLOBAL.language).Friends.INVITE_REASON + ': ' + this.props.data.inviteReason}</Text>
          <Text style={styles.time}>{new Date(this.props.data.inviteTime).Format("yyyy-MM-dd hh:mm:ss")}</Text>
        </View>
        {this._renderRight()}
      </View>
    )
  }
}

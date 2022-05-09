/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { PureComponent } from 'react'
import { View, Text } from 'react-native'
import { PermissionType } from 'imobile_for_reactnative'
import { ImageButton } from '../../components'
import { scaleSize } from '../../utils'
import { CheckStatus } from '../../constants'
import {
  getPublicAssets,
} from '../../assets'
import styles from './styles'

export interface CallbackParams {
  data: any,
  status: string,
}

interface Props {
  data: any,
  status: keyof PermissionType | undefined,
  searchableAction?: (params: CallbackParams) => void,
  readableAction?: (params: CallbackParams) => void,
}

interface State {
  searchable: boolean, // 可检索
  readable: boolean, // 可查看
}

export default class GroupItem extends PureComponent<Props, State> {

  constructor(props: Props) {
    super(props)
    let readable = false, searchable = false
    switch(props.status) {
      case 'DELETE':
      case 'READ':
      case 'READWRITE':
        readable = true
        searchable = true
        break
      case 'SEARCH':
        searchable = true
        break
    }
    this.state = {
      searchable,
      readable,
    }
  }

  renderCheckButton = ({ status = false, action = () => {} }) => {
    let icon = status ? getPublicAssets().common.icon_check : getPublicAssets().common.icon_uncheck
    return (
      <ImageButton
        containerStyle={styles.selectContainer}
        iconBtnStyle={styles.selectImgView}
        iconStyle={styles.selectImg}
        icon={icon}
        onPress={() => {
          action?.()
        }}
      />
    )
  }

  _searchableAction = () => {
    let readable = this.state.readable
    if (this.state.searchable) readable = false
    this.setState({
      readable,
      searchable: !this.state.searchable,
    }, () => {
      if (this.props.searchableAction) {
        let status = this.state.readable ? 'READ' : (this.state.searchable ? 'SERACH' : '')
        this.props.searchableAction?.({
          data: this.props.data,
          status,
        })
      }
    })
  }

  _readableAction = () => {
    let searchable = this.state.searchable
    if (!this.state.readable) searchable = true
    this.setState({
      searchable,
      readable: !this.state.readable,
    }, () => {
      if (this.props.readableAction) {
        let status = this.state.readable ? 'READ' : (this.state.searchable ? 'SERACH' : '')
        this.props.readableAction?.({
          data: this.props.data,
          status,
        })
      }
    })
  }

  render() {
    // let icon =
    //   this.props.data.themeType > 0
    //     ? getThemeIconByType(this.props.data.themeType)
    //     : getLayerIconByType(this.props.data.type)
    return (
      <View style={[styles.topView, { width: '100%' }]}>
        <View style={styles.topLeftView}>
          {/* <View style={styles.selectImgView}>
            <Image
              resizeMode="contain"
              style={styles.selectImg}
              source={icon}
            />
          </View> */}
          <Text
            numberOfLines={2}
            style={[
              styles.content,
              // { width: Dimensions.get('window').width - scaleSize(500) },
              { width: '80%' },
            ]}
          >
            {this.props.data.groupName}
          </Text>
        </View>
        <View style={[styles.topRightView2, { width: scaleSize(320) }]}>
          <View style={styles.select}>
            {this.renderCheckButton({
              status: this.state.searchable,
              action: this._searchableAction,
            })}
          </View>
          <View style={styles.select}>
            {this.renderCheckButton({
              status: this.state.readable,
              action: this._readableAction,
            })}
          </View>
        </View>
      </View>
    )
  }
}

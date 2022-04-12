import React from 'react'
import { View } from 'react-native'
import { Button } from '../../../../../components'
import { getLanguage } from '../../../../../language'

import MessageItem from './MessageItem'
import styles from './styles'


interface Props {
  data: any,
  isSelf: boolean,
  onPress: (data: any) => void,
}

export default class MemberMessageItem extends MessageItem {
  constructor(props: Props) {
    super(props)
    this.state = this._getData(props)
  }

  _getData = (props: Props) => {
    let state = {}
    if (props.isSelf) {
      state = {
        title: getLanguage(global.language).Friends.GROUP_APPLY_TITLE,
        content: [{
          title: getLanguage(global.language).Friends.GROUP_NAME,
          value: props.data.groupName,
        }, {
          title: getLanguage(global.language).Friends.APPLICANT,
          value: props.data.applicantNick,
        }, {
          title: getLanguage(global.language).Friends.APPLY_REASON,
          value: props.data.applyReason,
        }, {
          title: getLanguage(global.language).Friends.APPLY_TIME,
          value: new Date(props.data.applyTime).Format("yyyy-MM-dd hh:mm:ss"),
        }],
        isSelf: props.isSelf,
        data: props.data,
      }
    } else {
      state = {
        title: getLanguage(global.language).Friends.GROUP_APPLY_ALRADY_TITLE,
        content: [{
          title: getLanguage(global.language).Friends.GROUP_NAME,
          value: props.data.groupName,
        }, {
          title: getLanguage(global.language).Friends.CHECK_RESULT,
          value: props.data.checkStatus === 'ACCEPT'
            ? getLanguage(global.language).Friends.GROUP_APPLY_AGREE
            : getLanguage(global.language).Friends.GROUP_APPLY_REFUSE,
        }, {
          title: getLanguage(global.language).Friends.CHECK_TIME,
          value: new Date(props.data.applyTime).Format("yyyy-MM-dd hh:mm:ss"),
        }],
        isSelf: props.isSelf,
        data: props.data,
      }
    }
    return state
  }

  _agreeAction = () => {
    let _data = JSON.parse(JSON.stringify(this.props.data))
    _data.checkStatus = 'ACCEPTED'
    if (this.props.onPress) {
      this.props.onPress(_data)
    }
  }

  _disAgreeAction = () => {
    let _data = JSON.parse(JSON.stringify(this.props.data))
    _data.checkStatus = 'REFUSED'
    if (this.props.onPress) {
      this.props.onPress(_data)
    }
  }

  _renderButtons = () => {
    if (this.state.isSelf) {
      if (this.props.data.checkStatus === 'WAITING') {
        return (
          <View style={styles.buttons}>
            <Button style={styles.button} title={getLanguage(global.language).Friends.GROUP_APPLY_DISAGREE} onPress={this._disAgreeAction} />
            <Button style={[styles.button, {marginLeft: 20}]} title={getLanguage(global.language).Friends.GROUP_APPLY_AGREE} onPress={this._agreeAction} />
          </View>
        )
      } else {
        return (
          <Button
            disabled={true}
            style={styles.button}
            title={
              this.props.data.checkStatus === 'ACCEPTED'
                ? getLanguage(global.language).Friends.GROUP_APPLY_ALREADY_AGREE
                : getLanguage(global.language).Friends.GROUP_APPLY_ALREADY_DISAGREE
            }
          />
        )
      }
    } else {
      return null
    }
  }
}

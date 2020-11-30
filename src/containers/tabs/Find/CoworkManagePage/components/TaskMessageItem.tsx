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

export default class TaskMessageItem extends MessageItem {
  constructor(props: Props) {
    super(props)
    this.state = this._getData(props)
  }

  _getData = (props: Props) => {
    let state = {}
    state = {
      title: getLanguage(GLOBAL.language).Friends.GROUP_APPLY_TITLE,
      content: [{
        title: getLanguage(GLOBAL.language).Friends.TASK_TITLE,
        value: props.data.message.resourceName,
      }, {
        title: getLanguage(GLOBAL.language).Friends.TASK_CREATOR,
        value: props.data.message.nickname,
      }, {
        title: getLanguage(GLOBAL.language).Friends.TASK_TYPE,
        value: props.data.message.sourceType,
      }, {
        title: getLanguage(GLOBAL.language).Friends.TASK_UPDATE_TIME,
        value: new Date(props.data.message.createTime).Format("yyyy-MM-dd hh:mm:ss"),
      }],
      isSelf: props.isSelf,
      data: props.data,
    }
    // if (props.isSelf) {
    //   state = {
    //     title: getLanguage(GLOBAL.language).Friends.GROUP_APPLY_TITLE,
    //     content: [{
    //       title: getLanguage(GLOBAL.language).Friends.TASK_TITLE,
    //       value: props.data.message.resourceName,
    //     }, {
    //       title: getLanguage(GLOBAL.language).Friends.APPLICANT,
    //       value: props.data.message.resourceCreator,
    //     }, {
    //       title: getLanguage(GLOBAL.language).Friends.APPLY_REASON,
    //       value: props.data.user.userName,
    //     }, {
    //       title: getLanguage(GLOBAL.language).Friends.APPLY_TIME,
    //       value: new Date(props.data.message.createTime).Format("yyyy-MM-dd hh:mm:ss"),
    //     }],
    //     isSelf: props.isSelf,
    //     data: props.data,
    //   }
    // } else {
    //   state = {
    //     title: getLanguage(GLOBAL.language).Friends.GROUP_APPLY_ALRADY_TITLE,
    //     content: [{
    //       title: getLanguage(GLOBAL.language).Friends.GROUP_NAME,
    //       value: props.data.groupName,
    //     }, {
    //       title: getLanguage(GLOBAL.language).Friends.CHECK_RESULT,
    //       value: props.data.checkStatus === 'ACCEPT'
    //         ? getLanguage(GLOBAL.language).Friends.GROUP_APPLY_AGREE
    //         : getLanguage(GLOBAL.language).Friends.GROUP_APPLY_REFUSE,
    //     }, {
    //       title: getLanguage(GLOBAL.language).Friends.CHECK_TIME,
    //       value: new Date(props.data.applyTime).Format("yyyy-MM-dd hh:mm:ss"),
    //     }],
    //     isSelf: props.isSelf,
    //     data: props.data,
    //   }
    // }
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
            <Button style={styles.button} title={getLanguage(GLOBAL.language).Friends.GROUP_APPLY_DISAGREE} onPress={this._disAgreeAction} />
            <Button style={[styles.button, {marginLeft: 20}]} title={getLanguage(GLOBAL.language).Friends.GROUP_APPLY_AGREE} onPress={this._agreeAction} />
          </View>
        )
      } else {
        return (
          <Button
            disabled={true}
            style={styles.button}
            title={
              this.props.data.checkStatus === 'ACCEPTED'
                ? getLanguage(GLOBAL.language).Friends.GROUP_APPLY_ALREADY_AGREE
                : getLanguage(GLOBAL.language).Friends.GROUP_APPLY_ALREADY_DISAGREE
            }
          />
        )
      }
    } else {
      return null
    }
  }
}



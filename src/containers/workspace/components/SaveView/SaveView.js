/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
/**
 * 退出保存提示框
 */
import * as React from 'react'
import { PopMenu } from '../../../../components'
import { getLanguage } from '../../../../language'

export default class SaveView extends React.Component {
  props: {
    save?: () => {},
    notSave?: () => {},
    cancel?: () => {},
    device?: Object,
    backHide?: boolean,
    animated?: boolean,
    language: string,
  }

  static defaultProps = {
    animated: 'fade',
    backHide: true,
  }

  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      title: getLanguage(this.props.language).Prompt.SAVE_TITLE,
      save_yes: getLanguage(this.props.language).Prompt.SAVE_YES,
      save_no: getLanguage(this.props.language).Prompt.SAVE_NO,
      cancel: getLanguage(this.props.language).Prompt.CANCEL,
      position: {},
    }
    this.cb = () => {}
    this.customSave = undefined
    this.customNotSave = undefined
  }

  setTitle = (title, save_yes, save_no, cancel) => {
    this.setState({
      title: title,
      save_yes: save_yes,
      save_no: save_no,
      cancel: cancel,
    })
  }

  /**
   * 保存事件
   */
  save = () => {
    (async function() {
      let result
      if (this.customSave) {
        result = await this.customSave()
      } else if (this.props.save) {
        result = await this.props.save()
      }
      this.setVisible(false)
      if (result) {
        this.cb && typeof this.cb === 'function' && this.cb()
        this.cb = null
      }
      this.customSave = undefined
      this.customNotSave = undefined
    }.bind(this)())
  }

  /**
   * 不保存事件
   */
  notSave = () => {
    (async function() {
      if (this.customNotSave) {
        this.customNotSave()
      } else if (this.props.notSave) {
        this.props.notSave()
      }
      this.setVisible(false)

      this.cb && typeof this.cb === 'function' && this.cb()
      this.cb = null
      this.customSave = undefined
      this.customNotSave = undefined
    }.bind(this)())
  }

  /**
   * 取消事件
   */
  cancel = () => {
    this.props.cancel && this.props.cancel()
    // this.setVisible(false)
    this.cb = null
    this.customSave = undefined
    this.customNotSave = undefined
  }

  /**
   * 显示保存提示框
   * @param {boolean} visible 是否显示
   * @param {() => void} setLoading 设置加载界面的方法
   * @param {() => void} cb 保存和不保存事件之后的回调
   * @param {{left: number, right: number, top: number, bottom: number}} position 提示框位置
   */
  setVisible = (visible, params = {
    setLoading: undefined,
    cb: undefined,
    position: undefined,
    customSave: undefined,
    customNotSave: undefined,
  }) => {
    // if (this.state.visible === visible) return
    if (params?.setLoading && typeof params.setLoading === 'function') {
      this._setLoading = params.setLoading
    }
    if (params?.customSave && typeof params.customSave === 'function') {
      this.customSave = params.customSave
    }
    if (params?.customNotSave && typeof params.customNotSave === 'function') {
      this.customNotSave = params.customNotSave
    }
    this.menu.setVisible(visible, params?.position)
    this.cb = params?.cb || this.cb
  }

  /**
   * 设置
   * @param {boolean} loading 是否显示
   * @param {string} info 加载消息
   * @param {{bgColor: string, timeout: number}} extra 包含背景颜色，超时隐藏Loading时间
   */
  setLoading = (loading = false, info, extra) => {
    this._setLoading && this._setLoading(loading, info, extra)
  }

  getVisible = () => {
    return this.state.visible
  }

  getData = () => {
    return [
      {
        title: this.state.save_yes,
        action: this.save,
      },
      {
        title: this.state.save_no,
        action: this.notSave,
      },
    ]
  }

  render() {
    return (
      <PopMenu
        ref={ref => (this.menu = ref)}
        title={this.state.title}
        getData={this.getData}
        close={this.cancel}
        device={this.props.device}
      />
    )
  }
}

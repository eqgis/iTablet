/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { PopMenu } from '../../../../components'

export default class SaveView extends React.Component {
  props: {
    save?: () => {},
    notSave?: () => {},
    cancel?: () => {},
    device?: Object,
    backHide?: boolean,
    animated?: boolean,
  }

  static defaultProps = {
    animated: 'fade',
    backHide: true,
  }

  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      title: '是否保存当前地图？',
      save_yes: '保存',
      save_no: '不保存',
      cancel: '取消',
      position: {},
    }
    this.cb = () => {}
  }

  setTitle = (title, save_yes, save_no, cancel) => {
    this.setState({
      title: title,
      save_yes: save_yes,
      save_no: save_no,
      cancel: cancel,
    })
  }

  save = () => {
    (async function() {
      let result
      if (this.props.save) {
        result = await this.props.save()
      }
      this.setVisible(false)
      if (result) {
        this.cb && typeof this.cb === 'function' && this.cb()
        this.cb = null
      }
    }.bind(this)())
  }

  notSave = () => {
    (async function() {
      this.props.notSave && this.props.notSave()
      this.setVisible(false)

      this.cb && typeof this.cb === 'function' && this.cb()
      this.cb = null
    }.bind(this)())
  }

  cancel = () => {
    this.props.cancel && this.props.cancel()
    this.setVisible(false)
    this.cb = null
  }

  setVisible = (visible, setLoading, cb, position) => {
    // if (this.state.visible === visible) return
    if (setLoading && typeof setLoading === 'function') {
      this._setLoading = setLoading
    }
    this.menu.setVisible(visible, position)
    this.cb = cb || this.cb
  }

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
        device={this.props.device}
      />
    )
  }
}

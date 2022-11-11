import React from 'react'

interface Props {
  /** 超时时间 毫秒 */
  timeout: number
  /** 超时后执行事件 */
  trigger: () => void
}

class TimeoutTrigger extends React.Component<Props> {

  timer: NodeJS.Timer | null = null

  updatedTime = 0

  constructor(props: Props) {
    super(props)
  }

  componentWillUnmount(): void {
    this._clearTimer()
  }

  active = () => {
    this.updatedTime = new Date().getTime()
    this._startTimer()
  }

  deactive = () => {
    this._clearTimer()
  }

  updateTime = () => {
    this.updatedTime = new Date().getTime()
  }


  ///////////////////// 业务封装
  /** 点击一级菜单但不跳转 */
  onFirstMenuClick = () => {
    this.updateTime()
  }

  /** 点击一级菜单会有二级菜单或UI出现 */
  onShowSecondMenu = () => {
    this.deactive()
  }

  /** 从二级菜单返回一级菜单 */
  onBackFromSecondMenu = () => {
    this.active()
  }

  /** 点击扫描按钮进入扫描 */
  onShowScan = () => {
    this.deactive()
  }

  /** 扫描完成 或 退出扫描 */
  onBackFromScan = () => {
    this.active()
  }

  /** 侧边栏隐藏 */
  onBarHide = () => {
    this.deactive()
  }

  /** 侧边栏显示 */
  onBarShow = () => {
    this.active()
  }
  /////////////////// 业务封装 end

  _startTimer = () => {
    this._clearTimer()
    this.timer = setInterval(this._check, 1000)
  }

  _clearTimer = () => {
    if(this.timer !== null) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  _check = () => {
    const time = new Date().getTime()
    if(time - this.updatedTime > this.props.timeout) {
      this.props.trigger()
      this.updatedTime = time
    }
  }

  render() {
    return null
  }
}

export default TimeoutTrigger
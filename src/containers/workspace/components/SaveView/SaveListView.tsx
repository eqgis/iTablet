/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
/**
 * AR退出保存提示框
 */
import * as React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Dialog, CheckBox } from '../../../../components'
import { ChunkType } from '../../../../constants'
import { getLanguage } from '../../../../language'
import { scaleSize } from '../../../../utils'
import { size, color } from '../../../../styles'
import { getThemeAssets } from '../../../../assets'
import { SMap } from 'imobile_for_reactnative'

interface MapInfo {
  name: string,
  mapType: 'map' | 'ar',
  addition?: {[name: string]: any},
}

interface Props {
  save?: () => boolean,
  notSave?: () => void,
  cancel?: () => void,
  saveMap: (data: { mapName: string, nModule: string, addition?: {Template?: string} }) => boolean,
  saveARMap: (name: string) => boolean,

  getMaps: () => Promise<MapInfo[]>,
}

interface State {
  selectedData: Map<string, MapInfo>,
  maps: MapInfo[],
}

const styles = StyleSheet.create({
  checkBox: {
    height: scaleSize(44),
    width: scaleSize(44),
  },
  dialogStyle: {
    width: scaleSize(567),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: scaleSize(20),
  },
  items: {
    width: '100%',
    flexDirection: 'column',
    paddingLeft: scaleSize(40),
    marginTop: scaleSize(30),
    marginBottom: scaleSize(20),
  },
  item: {
    width: '100%',
    height: scaleSize(90),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  itemTitle: {
    marginLeft: scaleSize(8),
    textAlign: 'left',
    fontSize: size.fontSize.fontSizeLg,
    color: color.fontColorGray3,
    padding: 0,
    backgroundColor: 'transparent',
  },
  confirmTitleStyle: {
    color: color.item_selected_bg,
  },
})

export default class SaveListView extends React.Component<Props, State> {

  dialog: Dialog | undefined | null
  customSave: ((maps: Map<string, string>) => boolean) | undefined | null
  customNotSave: (() => boolean) | undefined | null
  cb: (() => boolean) | undefined | null
  _setLoading: ((loading: boolean, info?: string, extra?: {bgColor: string, timeout: number}) => boolean) | undefined | null

  constructor(props: Props) {
    super(props)
    this.state = {
      selectedData: new Map(),
      maps: [],
    }
  }

  async componentDidMount() {
    const maps = await this.getData()
    this.setState({
      maps: maps,
    })
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    if (
      JSON.stringify(nextProps) !== JSON.stringify(this.props) ||
      JSON.stringify(nextState) !== JSON.stringify(this.state) ||
      !nextState.selectedData.compare(this.state.selectedData)
    ) {
      return true
    }
    return false
  }

  getData = async () => {
    try {
      return await this.props.getMaps()
    } catch (error) {
      return []
    }
  }

  /**
   * 保存事件
   */
  save = async () => {
    try {
      let result: {mapResult?: boolean, armapResult?: boolean} = {}
      if (this.state.selectedData.size === 0) return false
      this._setLoading && this._setLoading(true, getLanguage(GLOBAL.language).Prompt.SAVING)
      for (const map of this.state.selectedData.values()) {
        switch(map.mapType) {
          case 'map':
            result.mapResult = await this.saveMap(map.name)
            break
          case 'ar':
            result.armapResult = await this.saveARMap(map.name)
            break
        }
      }
      this.setVisible(false)
      this._setLoading && this._setLoading(false)
      this.cb && typeof this.cb === 'function' && this.cb()
      return result
    } catch (error) {
      this._setLoading && this._setLoading(false)
      return false
    }
  }

  saveMap = async (name: string, addition?: {[name: string]: any}) => {
    try {
      if (GLOBAL.Type === ChunkType.MAP_NAVIGATION) {
        //这里先处理下异常 add xiezhy
        try {
          await SMap.stopGuide()
          await SMap.clearPoint()
        } catch (e) {
          this._setLoading && this._setLoading(false)
        }
      }
      let mapName = name
      // 导出(保存)工作空间中地图到模块
      let result = await this.props.saveMap({ mapName: mapName, nModule: '', addition })
      return result
    } catch (e) {
      GLOBAL.clickWait = false
      this._setLoading && this._setLoading(false)
    }
  }

  saveARMap = async (name: string) => {
    try {
      const result = await this.props.saveARMap(name)
      return result
    } catch (error) {
      return false
    }
  }

  /**
   * 不保存事件
   */
  notSave = async () => {
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
  }

  /**
   * 取消事件
   */
  cancel = () => {
    this.props.cancel && this.props.cancel()
    this.setVisible(false)
    this.cb = null
    this.customSave = undefined
    this.customNotSave = undefined
  }

  setTitle = () => {}

  /**
   * 显示保存提示框
   * @param {boolean} visible 是否显示
   * @param {() => void} setLoading 设置加载界面的方法
   * @param {() => void} cb 保存和不保存事件之后的回调
   */
  setVisible = async (visible: boolean, params = {
    setLoading: undefined,
    cb: undefined,
    customSave: undefined,
    customNotSave: undefined,
  }) => {
    if (this.dialog?.state.visible === visible) return
    if (params?.setLoading && typeof params.setLoading === 'function') {
      this._setLoading = params.setLoading
    }
    if (params?.customSave && typeof params.customSave === 'function') {
      this.customSave = params.customSave
    }
    if (params?.customNotSave && typeof params.customNotSave === 'function') {
      this.customNotSave = params.customNotSave
    }

    if (visible) {
      const maps = await this.getData()
      const selectedData = new Map()
      if (JSON.stringify(this.state.maps) !== JSON.stringify(maps)) {
        for (const map of maps) {
          // 打开默认只保存AR地图
          if (map.mapType === 'ar') {
            selectedData.set(map.name, map)
          } else {
            selectedData.delete(map.name)
          }
        }
        this.setState({maps, selectedData})
      }
    }

    this.cb = params?.cb || this.cb
    this.dialog?.setDialogVisible(visible)
  }

  /**
   * 设置
   * @param {boolean} loading 是否显示
   * @param {string} info 加载消息
   * @param {{bgColor: string, timeout: number}} extra 包含背景颜色，超时隐藏Loading时间
   */
  setLoading = (loading = false, info: string, extra: {bgColor: string, timeout: number}) => {
    this._setLoading && this._setLoading(loading, info, extra)
  }

  getVisible = () => {
    return this.dialog?.state.visible
  }

  renderItem = (item: any) => {
    return (
      <View style={styles.item}>
        <CheckBox
          style={styles.checkBox}
          checked={this.state.selectedData.has(item.name)}
          onChange={value => {
            this.setState(state => {
              const selected = new Map(state.selectedData)
              const isSelected = selected.has(item.name)
              if (value && !isSelected) {
                selected.set(item.name, item)
              } else {
                selected.delete(item.name)
              }
              return { selectedData: selected }
            })
          }}
          checkedImg={getThemeAssets().publicAssets.icon_check_in}
          unCheckedImg={getThemeAssets().publicAssets.icon_check}
          imgStyle={styles.checkBox}
        />
        <Text style={styles.itemTitle} numberOfLines={2}>
          {item.name}
        </Text>
      </View>
    )
  }

  renderItems = () => {
    const items: React.ReactElement[] = []
    if (this.state.maps && this.state.maps.length > 0) {
      for (const map of this.state.maps) {
        items.push(this.renderItem(map))
      }
    }
    return (
      <View style={styles.items}>
        {items}
      </View>
    )
  }

  render() {
    return (
      <Dialog
        ref={ref => (this.dialog = ref)}
        confirmAction={this.save}
        cancelAction={this.notSave}
        dismissAction={this.cancel}
        confirmBtnDisable={this.state.selectedData.size === 0}
        style={styles.dialogStyle}
        disableBackTouch={false}
        opacityStyle={styles.dialogStyle}
        info={getLanguage(GLOBAL.language).Prompt.SAVE_TITLE}
        confirmBtnTitle={getLanguage(GLOBAL.language).Prompt.SAVE_YES}
        cancelBtnTitle={getLanguage(GLOBAL.language).Prompt.SAVE_NO}
        confirmTitleStyle={[styles.confirmTitleStyle, this.state.selectedData.size === 0 && {color: color.fontColorGray}]}
      >
        {this.renderItems()}
      </Dialog>
    )
  }
}

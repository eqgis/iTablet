import * as React from 'react'
import InputPage from '../InputPage/InputPage'
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
} from 'react-native'
import { scaleSize, Toast } from '../../utils'
import NavigationService from '../NavigationService'
import { getPublicAssets } from '../../assets'
import { getLanguage } from '../../language'

export default class InputStyledText extends InputPage {
  constructor(props) {
    super(props)
    this.state = {
      ...this.state,
      foreColor: '#000000',
      backColor: '',
      fontSize: 30,
    }
  }

  confirm = () => {
    if (this.clickAble && this.state.isLegalName) {
      this.clickAble = false
      setTimeout(() => {
        this.clickAble = true
      }, 1500)
      this.input && this.input.blur()
      let fontSize = parseInt(this.state.fontSize)
      if (isNaN(fontSize) || fontSize === 0) {
        Toast.show(
          global.language == 'CN' ? '请输入字体大小' : 'Please input font size',
        )
        return
      }
      let styles = {
        foreColor: this.state.foreColor,
        fontSize: fontSize,
      }
      if (this.state.backColor !== '') {
        styles.backColor = this.state.backColor
      }
      this.cb && this.cb(this.state.value, styles)
    }
  }

  renderForeColor = () => {
    return (
      <TouchableOpacity
        style={styles.itemView}
        onPress={() => {
          NavigationService.navigate('ColorPickerPage', {
            colorViewType: 'ColorWheel',
            cb: color => {
              this.setState({ foreColor: color })
            },
          })
        }}
      >
        <Text style={{ flex: 1, fontSize: scaleSize(20), color: '#000000' }}>
          {getLanguage(global.language).Map_Main_Menu.STYLE_COLOR}
        </Text>
        <View
          style={{
            width: 40,
            height: 15,
            backgroundColor: this.state.foreColor,
          }}
        />
        <Image
          source={getPublicAssets().common.icon_move}
          style={{ width: 20, height: 20 }}
        />
      </TouchableOpacity>
    )
  }

  renderBackColor = () => {
    return (
      <TouchableOpacity
        style={styles.itemView}
        onPress={() => {
          NavigationService.navigate('ColorPickerPage', {
            colorViewType: 'ColorWheel',
            cb: color => {
              this.setState({ backColor: color })
            },
          })
        }}
      >
        <Text style={{ flex: 1, fontSize: scaleSize(20), color: '#000000' }}>
          {getLanguage(global.language).Map_Main_Menu.STYLE_BACKGROUND}
        </Text>
        <View
          style={{
            width: 40,
            height: 15,
            backgroundColor: this.state.backColor,
          }}
        />
        <Image
          source={getPublicAssets().common.icon_move}
          style={{ width: 20, height: 20 }}
        />
      </TouchableOpacity>
    )
  }

  renderFontSize = () => {
    return (
      <View style={styles.itemView}>
        <Text style={{ flex: 1, fontSize: scaleSize(20), color: '#000000' }}>
          {getLanguage(global.language).Map_Main_Menu.LEGEND_FONT}
        </Text>
        <TouchableOpacity
          onPress={() => {
            let value = this.state.fontSize
            this.setState({
              fontSize: --value > 1 ? value : 1,
            })
          }}
        >
          <Image
            source={require('../../assets/publicTheme/plot/plot_reduce.png')}
            style={{ width: 30, height: 30 }}
          />
        </TouchableOpacity>
        <TextInput
          style={{
            width: 30,
            height: 20,
            padding: 0,
            alignItems: 'center',
          }}
          defaultValue={this.state.fontSize + ''}
          value={this.state.fontSize + ''}
          keyboardType={'numeric'}
          maxLength={2}
          textAlign={'center'}
          onChangeText={text => {
            let value = this.clearNoNum(text)
            this.setState({ fontSize: value })
          }}
        />
        <TouchableOpacity
          onPress={() => {
            let value = this.state.fontSize
            this.setState({
              fontSize: ++value < 100 ? value : 99,
            })
          }}
        >
          <Image
            source={require('../../assets/publicTheme/plot/plot_add.png')}
            style={{ width: 30, height: 30 }}
          />
        </TouchableOpacity>
      </View>
    )
  }

  clearNoNum = value => {
    value = value.replace(/[^\d.]/g, '') //清除“数字”和“.”以外的字符
    value = value.replace(/\.{2,}/g, '.') //只保留第一个. 清除多余的
    value = value
      .replace('.', '$#$')
      .replace(/\./g, '')
      .replace('$#$', '.')
    // value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
    if (value.indexOf('.') < 0 && value != '') {
      //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
      value = parseFloat(value)
    }
    return value + ''
  }

  renderExtra = () => {
    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        {this.renderForeColor()}
        {this.renderBackColor()}
        {this.renderFontSize()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  itemView: {
    height: scaleSize(60),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
})

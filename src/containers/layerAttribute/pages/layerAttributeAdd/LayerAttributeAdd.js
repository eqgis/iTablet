/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native'
import { ImageButton, Row, Header, PopModal } from '../../../../components'
import { Toast, scaleSize } from '../../../../utils'
import { getLanguage } from '../../../../language'

import styles from './styles'
import { color } from '../../../../styles'
let typeStr = [
  ['布尔型', 'BOOLEAN', 1, 1],
  ['字节型', 'BYTE', 2,1],
  ['16位整型', 'INT16', 3, 2],
  ['32位整型', 'INT32', 4, 4],
  ['64位整型', 'INT64', 16, 8],
  ['单精度', 'SINGLE', 6, 4],
  ['双精度', 'DOUBLE', 7, 8],
  // ['日期型', 'DATETIME', 23,8],
  // ['二进制型', 'LONGBINARY', 11,0],
  ['文本型', 'TEXT', 10, 255],
  ['字符型', 'CHAR', 18, 255],
  // ['宽字符型', 'WTEXT', 127,255],
]

export default class LayerAttributeAdd extends React.Component {
  props: {
    navigation: Object,
    device: Object,
    data: Object,
    currentAttribute: Object,
    isDetail?: boolean,
    contentStyle?: Object,
    setCurrentAttribute: () => {},
    addAttributeField: () => {},
  }

  constructor(props) {
    super(props)
    let newData = this.dealData(this.props.data, this.props.isDetail)
    this.state = {
      ...newData,
    }
  }

  componentDidMount() { }

  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(prevProps.data) !==
      JSON.stringify(this.props.data) ||
      prevProps.isDetail !== this.props.isDetail
    ) {
      let data = this.dealData(this.props.data, this.props.isDetail)
      this.setState(data)
    }
  }

  dealData = (data, isDetail = this.props.isDetail) => {
    let _data = data && data.fieldInfo
    if (!_data) return {}
    if (_data && _data.type === 1) {
      _data.defaultValue = _data.defaultValue === '1'
    }
    let _isDetail = !!isDetail
    let newState = {
      data: _data,
      name:
        (_data &&
          (_isDetail
            ? _data.name
            : this.getTrimSmStr(_data.name) + '_1')) ||
        '',
      caption:
        (_data &&
          (_isDetail
            ? _data.caption
            : this.getTrimSmStr(_data.caption) + '_1')) ||
        '',
      type: (_data && _data.type) || '',
      maxLength: this.getDefaultMaxLength(_data.type),
      defaultValue:
        (_data && _data.defaultValue) ||
          typeof _data.defaultValue === 'boolean'
          ? _data.defaultValue
          : '',
      isRequired:
        _data && typeof _data.isRequired === 'boolean'
          ? _data.isRequired
          : '',
      isEdit: _isDetail,
      //缺省值是否能编辑
      isDefaultValueCanEdit: true,
    }
    return newState
  }

  setVisible = (visible, params) => {
    this.addPopModal && this.addPopModal.setVisible(visible)
    if (params && params.data) {
      let _data = this.dealData(params.data, params.isDetail)
      if (JSON.stringify(_data) !== JSON.stringify(this.state)) {
        this.setState(_data)
      }
    } else if (!params) {
      let _data = this.dealData(this.props.data, this.props.isDetail)
      if (JSON.stringify(_data) !== JSON.stringify(this.state)) {
        this.setState(_data)
      }
    }
  }

  confirmValidate = () => {
    let isConfirm = false
    if (!this.state.name || this.state.name === '') {
      Toast.show(getLanguage(global.language).Prompt.ENTER_NAME)
    } else if (this.state.name !== undefined && this.state.name !== '' && this.state.name.toLowerCase().indexOf('ss_') === 0) {
      Toast.show(getLanguage(global.language).Prompt.DEFAULT_NAMING_SS)
    } else if (!this.state.caption || this.state.caption === '') {
      Toast.show(getLanguage(global.language).Prompt.ENTER_CAPTION)
    } else if (this.state.caption !== undefined && this.state.caption !== '' && this.state.caption.toLowerCase().indexOf('ss_') === 0) {
      Toast.show(getLanguage(global.language).Prompt.DEFAULT_NAMING_SS)
    } else if (!this.state.type) {
      Toast.show(getLanguage(global.language).Prompt.CHOICE_TYPE)
    } else if (!this.state.maxLength) {
      Toast.show(getLanguage(global.language).Prompt.INPUT_LENGTH)
    } else if (
      this.state.defaultValue &&
      !this.checkDefaultValue(this.state.defaultValue)
    ) {
      Toast.show(getLanguage(global.language).Prompt.DEFAULT_VALUE_EROROR)
    } else if (
      this.state.isRequired === '' ||
      this.state.isRequired === undefined
    ) {
      Toast.show(getLanguage(global.language).Prompt.SELECT_REQUIRED)
    } else if (
      this.state.isRequired &&
      (this.state.defaultValue === '' || this.state.defaultValue === undefined)
    ) {
      Toast.show(
        getLanguage(global.language).Prompt.ATTRIBUTE_DEFAULT_VALUE_IS_NULL,
      )
    } else {
      isConfirm = true
    }
    return isConfirm
  }

  //确认
  confirm = async isContinue => {
    if (!this.confirmValidate()) {
      return
    }
    let result = {
      caption: this.getTrimSmStr(this.state.caption),
      name: this.getTrimSmStr(this.state.name),
      type: this.state.type,
      maxLength: this.state.maxLength,
      required: this.state.isRequired,
    }
    if (result.required) {
      result.defaultValue = this.state.defaultValue
    }
    let _result = this.props.addAttributeField && await this.props.addAttributeField(result)
    if (!_result) return
    if (isContinue) {
      let tempName = this.state.name + '_1'
      let tempCaption = this.state.caption + '_1'
      this.setState({
        name: tempName,
        caption: tempCaption,
      })
    } else {
      this.setVisible(false)
    }
  }

  getTrimSmStr = text => {
    if (text.length < 2) {
      return text
    }
    let tempStr = text.toLowerCase()
    if (tempStr.substring(0, 2) == 'sm') {
      let endStr = text.substring(2, text.length)
      if (endStr.length < 2) {
        return endStr
      } else {
        return this.getTrimSmStr(endStr)
      }
    } else {
      return text
    }
  }

  getType = ({ labelTitle, value }) => {
    switch (labelTitle) {
      case getLanguage(global.language).Map_Attribute.TYPE:
        this.setState({
          type: value,
        })
        break
      case getLanguage(global.language).Map_Attribute.REQUIRED:
        this.setState({
          isRequired: value,
          isDefaultValueCanEdit: value,
        })
        break
      case getLanguage(global.language).Map_Attribute.DEFAULT_VALUE:
        this.setState({
          defaultValue: value,
        })
    }
  }

  getInputValue = ({ title, text }) => {
    switch (title) {
      case getLanguage(global.language).Map_Attribute.NAME:
        this.setState({
          name: text,
        })
        break
      case getLanguage(global.language).Map_Attribute.ALIAS:
        this.setState({
          caption: text,
        })
        break
      case getLanguage(global.language).Map_Attribute.REQUIRED:
        this.setState({
          maxLength: parseInt(text),
        })
        break
      case getLanguage(global.language).Map_Attribute.DEFAULT_VALUE:
        this.setState({
          defaultValue: text,
        })
        break
    }
  }

  reset = () => {
    this.table && this.table.reset(this.props.currentAttribute)
  }

  renderBtns = () => {
    if (this.state.isEdit) {
      return null
    }
    return (
      <View style={[
        styles.btns,
        {
          paddingBottom: this.props.device.orientation.indexOf('LANDSCAPE') >= 0
            ? scaleSize(30)
            : scaleSize(100),
        },
      ]}>
        <ImageButton
          title={getLanguage(global.language).Map_Attribute.CONFIRM_ADD}
          titleStyle={styles.text1}
          containerStyle={[styles.btn, styles.btn1]}
          direction={'row'}
          onPress={() => this.confirm(false)}
        />
        <ImageButton
          title={getLanguage(global.language).Map_Plotting.PLOTTING_ANIMATION_CONTINUE}
          titleStyle={styles.text2}
          containerStyle={[styles.btn, styles.btn2]}
          direction={'row'}
          iconBtnStyle={styles.selectImgView}
          iconStyle={styles.selectImg}
          icon={require('../../../../assets/publicTheme/plot/plot_add.png')}
          onPress={() => this.confirm(true)}
        />
      </View>
    )
  }

  checkDefaultValue(text) {
    let checkFlag = true
    let r
    let value
    switch (this.state.type) {
      case 3:
        r = /^(0|\+?[1-9][0-9]*)$/ //正整数和0
        checkFlag = r.test(text)
        if (checkFlag) {
          value = parseInt(text)
          checkFlag = value <= Math.pow(2, 15) - 1 && value >= -Math.pow(2, 15)
        }
        break
      case 4:
        r = /^(0|\+?[1-9][0-9]*)$/ //正整数和0
        checkFlag = r.test(text)
        if (checkFlag) {
          value = parseInt(text)
          checkFlag = value <= Math.pow(2, 31) - 1 && value >= -Math.pow(2, 31)
        }
        break
      case 16:
        r = /^(0|\+?[1-9][0-9]*)$/ //正整数和0
        checkFlag = r.test(text)
        if (checkFlag) {
          value = parseInt(text)
          checkFlag = value <= Math.pow(2, 63) - 1 && value >= -Math.pow(2, 63)
        }
        break
      case 6:
        r = /^\d+(\.\d+)?$/ //小数
        checkFlag = r.test(text)
        if (checkFlag) {
          value = parseFloat(text)
          checkFlag = value <= 3.40E+38 && value >= -3.40E+38
        }
        break
      case 7:
        r = /^\d+(\.\d+)?$/ //小数
        checkFlag = r.test(text)
        if (checkFlag) {
          value = parseFloat(text)
          checkFlag = value <= 1.79E+308 && value >= -1.79E+308
        }
        break
    }
    return checkFlag
  }

  //获取默认长度
  getDefaultMaxLength(type) {
    for (let i = 0; i < typeStr.length; i++) {
      if (type === typeStr[i][2]) {
        return typeStr[i][3]
      }
    }
    return 0
  }

  getSelected = ({ title, selected, index, value }) => {
    this.getType({
      labelTitle: title,
      title,
      value,
      selected,
      index,
    })
  }

  getDefaultValue = type => {
    let defaultValue
    if (type === 1) {
      defaultValue = true
    } else if (type === 10) {
      defaultValue = ''
    } else {
      defaultValue = 0 + ''
    }
    return defaultValue
  }

  renderDefaultValue = () => {
    let defaultValueTile = getLanguage(global.language).Map_Attribute.DEFAULT_VALUE
    return !this.state.isRequired ? null : this.state.type === 1 ? (
      <Row
        style={{ marginTop: scaleSize(15) }}
        titleStyle={styles.titleStyle}
        key={'缺省值'}
        type={Row.Type.RADIO_GROUP}
        title={defaultValueTile}
        disable={this.state.isEdit && this.state.isDefaultValueCanEdit}
        defaultValue={this.state.defaultValue}
        radioArr={[
          { title: getLanguage(global.language).Prompt.YES, value: true },
          { title: getLanguage(global.language).Prompt.NO, value: false },
        ]}
        radioColumn={2}
        getValue={this.getType}
      />
    ) : (
      <Row
        style={{ marginTop: scaleSize(30) }}
        titleStyle={styles.titleStyle}
        customRightStyle={styles.customRightStyle}
        disableStyle={styles.disableStyle}
        key={'缺省值'}
        disable={this.state.isEdit && this.state.isDefaultValueCanEdit}
        defaultValue={this.state.defaultValue + ''}
        type={Row.Type.INPUT_WRAP}
        title={defaultValueTile}
        getValue={this.getInputValue}
      />
    )
  }

  renderHeader = () => {
    return (
      <Header
        navigation={this.props.navigation}
        title={
          this.state.isEdit
            ? getLanguage(global.language).Map_Attribute.ATTRIBUTE_DETAIL
            : getLanguage(global.language).Map_Attribute.ATTRIBUTE_ADD
        }
        backAction={() => {
          this.props.backAction && this.props.backAction()
        }}
        headerStyle={[
          { borderBottomWidth: 0 },
          this.props.device.orientation.indexOf('LANDSCAPE') < 0 && styles.containerP,
        ]}
      />
    )
  }

  renderTypeSelect = () => {
    let types = [], row = [], column = this.props.device.orientation.indexOf('LANDSCAPE') >= 0 ? 2 : 3
    for (let i = 0; i < typeStr.length; i++) {
      let value = typeStr[i][2]
      row.push(
        <TouchableOpacity
          key={typeStr[i][1]}
          style={[styles.typeView, this.state.type === value && { borderColor: color.selected_blue }]}
          onPress={() => {
            if (this.state.isEdit) return
            let tempLength = this.getDefaultMaxLength(value)
            let defaultValue = this.getDefaultValue(value)
            this.setState({
              type: value,
              defaultValue: defaultValue,
              maxLength: tempLength,
            })
          }}
        >
          <Text style={styles.typeText}>{global.language === 'CN' ? typeStr[i][0] : typeStr[i][1]}</Text>
        </TouchableOpacity>
      )
      if (row.length === column || i === typeStr.length - 1) {
        types.push(<View key={'typeRow-' + Math.ceil((i + 1) / column)} style={styles.typeRow} >{row}</View>)
        row = []
      }
    }
    return (
      <View style={styles.typeRows}>
        {types}
      </View>
    )
  }

  renderRows = () => {
    return (
      <ScrollView
        style={styles.rows}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <Row
          style={{ marginTop: scaleSize(30) }}
          titleStyle={styles.titleStyle}
          customRightStyle={styles.customRightStyle}
          disableStyle={styles.disableStyle}
          key={'名称'}
          disable={this.state.isEdit}
          defaultValue={this.state.name}
          type={Row.Type.INPUT_WRAP}
          title={getLanguage(global.language).Map_Attribute.NAME}
          getValue={this.getInputValue}
        />
        <Row
          style={{ marginTop: scaleSize(15) }}
          titleStyle={styles.titleStyle}
          customRightStyle={styles.customRightStyle}
          disableStyle={styles.disableStyle}
          key={'别名'}
          disable={this.state.isEdit}
          defaultValue={this.state.caption}
          type={Row.Type.INPUT_WRAP}
          title={getLanguage(global.language).Map_Attribute.ALIAS}
          getValue={this.getInputValue}
        />
        <Row
          style={{ marginTop: scaleSize(30), alignItems: 'flex-start' }}
          titleStyle={[styles.titleStyle, { marginTop: scaleSize(22) }]}
          key={'类型'}
          type={Row.Type.RADIO_GROUP}
          title={getLanguage(global.language).Map_Attribute.TYPE}
          defaultValue={this.state.type}
          disable={this.state.isEdit}
          orientation={this.props.device.orientation}
          renderRightView={this.renderTypeSelect}
        />
        <Row
          style={{ marginTop: scaleSize(25) }}
          titleStyle={styles.titleStyle}
          customRightStyle={styles.customRightStyle}
          disableStyle={styles.disableStyle}
          key={'长度'}
          type={Row.Type.TEXT_BTN}
          title={getLanguage(global.language).Map_Attribute.LENGTH}
          disable={true}
          value={this.state.maxLength ? this.state.maxLength + '' : null}
        />

        <Row
          style={{ marginTop: scaleSize(15) }}
          titleStyle={styles.titleStyle}
          key={'必填'}
          type={Row.Type.RADIO_GROUP}
          title={getLanguage(global.language).Map_Attribute.REQUIRED}
          disable={this.state.isEdit}
          defaultValue={this.state.isRequired}
          radioArr={[
            { title: getLanguage(global.language).Prompt.YES, value: true },
            { title: getLanguage(global.language).Prompt.NO, value: false },
          ]}
          radioColumn={2}
          getValue={this.getType}
        />
        {this.renderDefaultValue()}
      </ScrollView>
    )
  }

  render() {
    return (
      <PopModal
        ref={ref => (this.addPopModal = ref)}
        modalVisible={this.state.addControllerVisible}
        contentStyle={this.props.contentStyle}
      >
        <View style={[
          styles.container,
          this.props.device.orientation.indexOf('LANDSCAPE') < 0 && styles.containerP,
        ]}>
          {this.renderHeader()}
          {this.renderRows()}
          {this.renderBtns()}
        </View>
      </PopModal>
    )
  }
}

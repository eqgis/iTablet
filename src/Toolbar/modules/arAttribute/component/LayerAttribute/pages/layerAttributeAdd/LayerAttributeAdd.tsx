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
  StyleProp,
  ViewStyle,
  Platform,
  Image,
} from 'react-native'

import styles from './styles'
import { AppStyle, dp, scaleSize, Toast } from '../../../../../../../utils'
import { getImage } from '../../../../../../../assets'
import { CustomModal, Row } from '@/components'
import { getCurrentLanguage, getLanguage } from '../../../../../../../language'
import { TFieldType } from 'imobile_for_reactnative'
import { FieldInfo1 } from 'imobile_for_reactnative/types/data'
import Button from '@/components/Button'
interface MType {
  cn: string,
  en: string,
  type: TFieldType,
  length: number,
}
const typeStr: Array<MType> = [
  {cn: '布尔型', en: 'BOOLEAN', type: 1, length: 1},
  {cn: '字节型', en: 'BYTE', type: 2, length: 1},
  {cn: '16位整型', en: 'INT16', type: 3, length: 2},
  {cn: '32位整型', en: 'INT64', type: 4, length: 4},
  {cn: '64位整型', en: 'BOOLEAN', type: 16, length: 8},
  {cn: '单精度', en: 'SINGLE', type: 6, length: 4},
  {cn: '双精度', en: 'DOUBLE', type: 7, length: 8},
  {cn: '文本型', en: 'TEXT', type: 10, length: 255},
  {cn: '字符型', en: 'CHAR', type: 18, length: 255},
]

type ValueType = boolean | string | number

export interface AddResult {
  caption: string,
  name: string,
  type: TFieldType,
  maxLength: number,
  required: boolean,
  defaultValue:ValueType,
}


interface Props {
  // navigation: Object,
  device: any, //todo
  data: FieldInfo1,
  // currentAttribute: Object,
  isDetail?: boolean,
  contentStyle?: StyleProp<ViewStyle>,
  addAttributeField: (result: AddResult) => Promise<boolean>,
  backAction: () => void,
}

interface State {
  data: unknown,
  name: string,
  caption: string,
  type: TFieldType,
  maxLength: number,
  defaultValue: ValueType,
  isRequired: boolean | string | boolean | undefined,
  isEdit: boolean,
  //缺省值是否能编辑
  isDefaultValueCanEdit: boolean,
  visible: boolean,
}

export default class LayerAttributeAdd extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
    const newData = this.dealData(this.props.data, this.props.isDetail)
    this.state = {
      ...newData,
      visible: false,
    }
  }

  componentDidMount() { }

  componentDidUpdate(prevProps: Props) {
    if (
      JSON.stringify(prevProps.data) !==
      JSON.stringify(this.props.data) ||
      prevProps.isDetail !== this.props.isDetail
    ) {
      const data = this.dealData(this.props.data, this.props.isDetail)
      this.setState({
        ...data,
      })
    }
  }

  dealData = (data: FieldInfo1, isDetail = this.props.isDetail): Omit<State, 'visible'>  => {
    const _data = data && data.fieldInfo
    if (!_data) return this.state
    if (_data && _data.type === 1) {
      _data.defaultValue = _data.defaultValue === '1'
    }
    const _isDetail = !!isDetail
    return {
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
      maxLength: parseFloat(this.getDefaultMaxLength(_data.type) + ''),
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
  }

  setVisible = (visible: boolean, params?: {data: FieldInfo1, isDetail: boolean}) => {
    if (params && params.data) {
      const _data = this.dealData(params.data, params.isDetail)
      if (JSON.stringify(_data) !== JSON.stringify(this.state)) {
        this.setState({
          ..._data,
          visible: visible,
        })
      }
    } else if (!params) {
      const _data = this.dealData(this.props.data, this.props.isDetail)
      if (JSON.stringify(_data) !== JSON.stringify(this.state)) {
        this.setState({
          ..._data,
          visible: visible,
        })
      }
    }
  }

  confirmValidate = () => {
    let isConfirm = false
    if (!this.state.name || this.state.name === '') {
      Toast.show(getLanguage().ENTER_NAME)
    } else if (this.state.name !== undefined && this.state.name !== '' && this.state.name.toLowerCase().indexOf('ss_') === 0) {
      Toast.show(getLanguage().DEFAULT_NAMING_SS)
    } else if (!this.state.caption || this.state.caption === '') {
      Toast.show(getLanguage().ENTER_CAPTION)
    } else if (this.state.caption !== undefined && this.state.caption !== '' && this.state.caption.toLowerCase().indexOf('ss_') === 0) {
      Toast.show(getLanguage().DEFAULT_NAMING_SS)
    } else if (!this.state.type) {
      Toast.show(getLanguage().CHOICE_TYPE)
    } else if (!this.state.maxLength) {
      Toast.show(getLanguage().INPUT_LENGTH)
    } else if (
      this.state.defaultValue &&
      !this.checkDefaultValue(this.state.defaultValue + '')
    ) {
      Toast.show(getLanguage().DEFAULT_VALUE_EROROR)
    } else if (
      this.state.isRequired === '' ||
      this.state.isRequired === undefined
    ) {
      Toast.show(getLanguage().SELECT_REQUIRED)
    } else if (
      this.state.isRequired &&
      (this.state.defaultValue === '' || this.state.defaultValue === undefined)
    ) {
      Toast.show(
        getLanguage().ATTRIBUTE_DEFAULT_VALUE_IS_NULL,
      )
    } else {
      isConfirm = true
    }
    return isConfirm
  }

  //确认
  confirm = async (isContinue: boolean) => {
    if (!this.confirmValidate()) {
      return
    }
    const result: AddResult = {
      caption: this.getTrimSmStr(this.state.caption),
      name: this.getTrimSmStr(this.state.name),
      type: this.state.type,
      maxLength: this.state.maxLength,
      required: !!this.state.isRequired,
      defaultValue: this.state.defaultValue,
    }
    if (result.required) {
      result.defaultValue = this.state.defaultValue
    }
    const _result = this.props.addAttributeField && await this.props.addAttributeField(result)
    if (!_result) return
    if (isContinue) {
      const tempName = this.state.name + '_1'
      const tempCaption = this.state.caption + '_1'
      this.setState({
        name: tempName,
        caption: tempCaption,
      })
    } else {
      this.setVisible(false)
    }
  }

  getTrimSmStr = (text: string): string => {
    if (text.length < 2) {
      return text
    }
    const tempStr = text.toLowerCase()
    if (tempStr.substring(0, 2) == 'sm') {
      const endStr = text.substring(2, text.length)
      if (endStr.length < 2) {
        return endStr
      } else {
        return this.getTrimSmStr(endStr)
      }
    } else {
      return text
    }
  }

  getType = ({ labelTitle, value }: { labelTitle: string, value: TFieldType | string | boolean }) => {
    switch (labelTitle) {
      // case getLanguage().ARMap.TYPE:
      //   this.setState({
      //     type: parseInt(value + ''),
      //   })
      //   break
      case getLanguage().REQUIRED:
        this.setState({
          isRequired: !!value,
          isDefaultValueCanEdit: !!value,
        })
        break
      case getLanguage().DEFAULT:
        this.setState({
          defaultValue: value,
        })
    }
  }

  getInputValue = ({ title, text }: { title: string, text: string }) => {
    switch (title) {
      case getLanguage().NAME:
        this.setState({
          name: text,
        })
        break
      case getLanguage().ALIAS:
        this.setState({
          caption: text,
        })
        break
      case getLanguage().REQUIRED:
        this.setState({
          maxLength: parseInt(text),
        })
        break
      case getLanguage().DEFAULT:
        this.setState({
          defaultValue: text,
        })
        break
    }
  }

  reset = () => {
    // this.table && this.table.reset(this.props.currentAttribute)
  }

  renderBtns = () => {
    if (this.state.isEdit) {
      return null
    }
    return (
      <View style={styles.btns}>
        <Button
          title={getLanguage().CONFIRM_ADD}
          titleStyle={styles.text1}
          style={[styles.btn, styles.btn1]}
          onPress={() => this.confirm(false)}
        />
        <Button
          title={getLanguage().PLOTTING_ANIMATION_CONTINUE}
          titleStyle={styles.text2}
          style={[styles.btn, styles.btn2]}
          // iconBtnStyle={styles.selectImgView}
          // iconStyle={styles.selectImg}
  
          // todo image
          image={getImage().icon_new}
          onPress={() => this.confirm(true)}
        />
      </View>
    )
  }

  checkDefaultValue = (text: string) => {
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
  getDefaultMaxLength = (type: number) => {
    for (const element of typeStr) {
      if (type === element.type) {
        return element.length
      }
    }
    return 0
  }

  getSelected = ({ title, value }: { title: string, value: string }) => {
    this.getType({
      labelTitle: title,
      value,
    })
  }

  getDefaultValue = (type: number) => {
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
    const defaultValueTile = getLanguage().DEFAULT
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
          { title: getLanguage().YES, value: true },
          { title: getLanguage().NO, value: false },
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

  renderBottom = () => {
    return (
      <View
        style={{
          height: dp(60),
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: dp(37),
          backgroundColor: AppStyle.Color.WHITE,
        }}
      >
        <TouchableOpacity
          onPress={this.close}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            source={getImage().icon_toolbar_quit}
            style={{width: dp(22), height:dp(22)}}
          />
        </TouchableOpacity>
      </View>
    )
  }

  renderTypeSelect = () => {
    const types = []
    const column = 4
    let row = []
    for (let i = 0; i < typeStr.length; i++) {
      const value: TFieldType = typeStr[i].type
      row.push(
        <TouchableOpacity
          key={typeStr[i].en}
          style={[styles.typeView, this.state.type === value && { borderColor: AppStyle.Color.BLUE }]}
          onPress={() => {
            if (this.state.isEdit) return
            const tempLength = this.getDefaultMaxLength(value)
            const defaultValue = this.getDefaultValue(value)
            this.setState({
              type: value,
              defaultValue: defaultValue,
              maxLength: tempLength,
            })
          }}
        >
          <Text style={styles.typeText}>{getCurrentLanguage() === 'CN' ? typeStr[i].cn : typeStr[i].en}</Text>
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
          style={{ marginTop: scaleSize(30), flexDirection: 'column' }}
          titleStyle={styles.titleStyle}
          customRightStyle={styles.customRightStyle}
          disableStyle={styles.disableStyle}
          key={'名称'}
          disable={this.state.isEdit}
          defaultValue={this.state.name}
          type={Row.Type.INPUT_WRAP}
          title={getLanguage().NAME}
          getValue={this.getInputValue}
        />
        <Row
          style={{ marginTop: scaleSize(15), flexDirection: 'column' }}
          titleStyle={styles.titleStyle}
          customRightStyle={styles.customRightStyle}
          disableStyle={styles.disableStyle}
          key={'别名'}
          disable={this.state.isEdit}
          defaultValue={this.state.caption}
          type={Row.Type.INPUT_WRAP}
          title={getLanguage().ALIAS}
          getValue={this.getInputValue}
        />
        <Row
          style={{ marginTop: scaleSize(30), alignItems: 'flex-start', flexDirection: 'column' }}
          titleStyle={[styles.titleStyle, { marginTop: scaleSize(22) }]}
          customRightStyle={{ flex: 1 }}
          key={'类型'}
          type={Row.Type.RADIO_GROUP}
          title={getLanguage().TYPE}
          defaultValue={this.state.type}
          disable={this.state.isEdit}
          orientation={this.props.device.orientation}
          renderRightView={this.renderTypeSelect}
        />
        <Row
          style={{ marginTop: scaleSize(25), flexDirection: 'column' }}
          titleStyle={styles.titleStyle}
          customRightStyle={styles.customRightStyle}
          disableStyle={styles.disableStyle}
          key={'长度'}
          type={Row.Type.TEXT_BTN}
          title={getLanguage().LENGTH}
          disable={true}
          value={this.state.maxLength ? this.state.maxLength + '' : undefined}
        />

        <Row
          style={{ marginTop: scaleSize(15) }}
          titleStyle={styles.titleStyle}
          key={'必填'}
          type={Row.Type.RADIO_GROUP}
          title={getLanguage().REQUIRED}
          disable={this.state.isEdit}
          defaultValue={this.state.isRequired}
          radioArr={[
            { title: getLanguage().YES, value: true },
            { title: getLanguage().NO, value: false },
          ]}
          radioColumn={2}
          getValue={this.getType}
        />
        {this.renderDefaultValue()}
      </ScrollView>
    )
  }

  close = () => {
    this.setState({
      visible: false,
    })
  }

  _onRequestClose = () => {
    if (Platform.OS === 'android') {
      this.close()
    }
  }
  // 'portrait' | 'portrait-upside-down' | 'landscape' | 'landscape-left' | 'landscape-right'
  render() {
    return (
      <CustomModal
        animationType={'none'}
        transparent={true}
        onBackPress={this._onRequestClose}
        visible={this.state.visible}
      >
        <View style={[
          styles.container,
          this.props.device.orientation.indexOf('LANDSCAPE') < 0 && styles.containerP,
          {backgroundColor: 'transparent', overflow: 'hidden', flex: 1},
          // this.props.contentStyle,
        ]}>
          <TouchableOpacity style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right:0, backgroundColor: AppStyle.Color.OVERLAY }} onPress={this._onRequestClose} />
          <View style={{ flex: 1, backgroundColor: '#rgba(0,0,0,0)' }} pointerEvents='none' />
          <View
            style={[
              styles.container,
              this.props.device.orientation.indexOf('LANDSCAPE') < 0 && styles.containerP,
              this.props.contentStyle,
              {overflow: 'hidden'},
            ]}
          >
            {this.renderRows()}
            {this.renderBtns()}
            {this.renderBottom()}
          </View>
        </View>
      </CustomModal>
    )
  }
}

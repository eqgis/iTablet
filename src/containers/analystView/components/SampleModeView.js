import * as React from 'react'

import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  // KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native'
import { size, color } from '../../../styles'
import { scaleSize } from '../../../utils'
import { getLanguage } from '../../../language'
import { CheckBox, PopView, RadioGroup } from '../../../components'

const styles = StyleSheet.create({
  containerSampleMode: {
    height: scaleSize(300),
  },
  headerItem: {
    flexDirection: 'row',
    height: scaleSize(60),
    padding: scaleSize(30),
    alignItems: 'center',
    alignSelf: 'center',
  },
  cancelText: {
    fontSize: size.fontSize.fontSizeXl,
    height: scaleSize(32),
    color: color.black,
    textAlign: 'center',
    padding: scaleSize(3),
  },
  confirmText: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: scaleSize(45),
    borderColor: color.black,
    margin: scaleSize(18),
    borderWidth: 1,
    borderRadius: scaleSize(4),
    backgroundColor: 'transparent',
    textAlign: 'center',
    color: color.themeText2,
    fontSize: size.fontSize.fontSizeMd,
    ...Platform.select({
      android: {
        padding: 0,
      },
    }),
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: color.background,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: scaleSize(30),
    marginTop: scaleSize(30),
    height: scaleSize(80),
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: scaleSize(30),
    height: scaleSize(60),
  },
  subItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: scaleSize(30),
    height: scaleSize(60),
  },
  sampleModeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: scaleSize(60),
  },
  text: {
    fontSize: size.fontSize.fontSizeSm,
    height: scaleSize(24),
    marginLeft: scaleSize(24),
    color: color.black,
  },
  subText: {
    fontSize: size.fontSize.fontSizeXl,
    height: scaleSize(32),
    marginLeft: scaleSize(15),
    color: color.black,
  },
  titelText: {
    fontSize: size.fontSize.fontSizeSm,
    height: scaleSize(24),
    color: color.black,
  },
})

export default class SampleModeView extends React.Component {
  props: {
    navigation: Object,
    data: Object,
    getData: Function,
  }

  constructor(props) {
    super(props)

    this.state = {
      data: {
        checked: false,
        SampleMode: -1,
        cellSize: 0,
      },
      visiable: false,
    }
  }

  setVisable(_visiable) {
    this.PopView.setVisible(_visiable)
  }

  getSelectData() {
    let _data = this.state.data
    this.props.getData(_data)
  }

  setData(_data) {
    this.setState({
      data: _data,
    })
  }

  getType = result => {
    let _data = this.state.data
    _data.sampleModeTitle = result.title
    _data.sampleMode = result.value
    this.setState({
      data: _data,
    })
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
    } else if (value == '') {
      value = 0
    }
    return value
  }

  renderContentView() {
    return (
      <View style={styles.containerSampleMode}>
        <View
          style={{
            height: scaleSize(300),
          }}
        >
          <View style={styles.headerItem}>
            <TouchableOpacity
              style={styles.cancelText}
              onPress={() => {
                this.PopView.setVisible(false)
              }}
            >
              <Text style={styles.cancelText}>
                {getLanguage(global.language).Analyst_Labels.CANCEL}
              </Text>
            </TouchableOpacity>

            <View style={styles.confirmText}>
              <TouchableOpacity
                style={styles.cancelText}
                onPress={() => {
                  this.PopView.setVisible(false)
                  this.props.getData(this.state.data)
                }}
              >
                <Text style={styles.cancelText}>
                  {getLanguage(global.language).Analyst_Labels.CONFIRM}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.line} />

          <View style={styles.itemHeader}>
            <CheckBox
              style={{
                height: scaleSize(30),
                width: scaleSize(30),
              }}
              checked={this.state.data.checked}
              onChange={value => {
                let _data = this.state.data
                _data.checked = value
                this.setState({
                  data: _data,
                })
              }}
            />
            <Text style={styles.subText}>
              {
                getLanguage(global.language).Analyst_Labels
                  .REGISTRATION_RESAMPLE
              }
            </Text>
          </View>

          {/* <View style={styles.item}>
                        <Text style={styles.titelText}>
                            {getLanguage(global.language).Analyst_Labels
                                        .REGISTRATION_SAMPLE_MODE+':'}
                        </Text>
                        <View style={styles.sampleModeItem}>
                            <View  style={styles.subItem}>
                                <CheckBox
                                    style={{
                                    flex: 1,
                                    height: scaleSize(30),
                                    width: scaleSize(30),
                                    }}
                                    checked={this.state.data.SampleMode&&this.state.data.SampleMode ==0}
                                    onChange={value => {
                                        let _data = this.state.data
                                        if(value){
                                            _data.SampleMode = 0
                                        }else{
                                            _data.SampleMode = -1
                                        }
                                        this.setData({
                                            data:_data
                                        })

                                    }}
                                />
                                <Text style={styles.subText}>
                                {getLanguage(global.language).Analyst_Labels.REGISTRATION_SAMPLE_MODE_NEAR}
                                </Text>
                            </View>
                            <View style={styles.subItem}>
                                <CheckBox
                                    style={{
                                    flex: 1,
                                    height: scaleSize(30),
                                    width: scaleSize(30),
                                    }}
                                    checked={this.state.data.SampleMode&&this.state.data.SampleMode ==1}
                                    onChange={value => {
                                        let _data = this.state.data
                                        if(value){
                                            _data.SampleMode = 1
                                        }else{
                                            _data.SampleMode = -1
                                        }
                                        this.setData({
                                            data:_data
                                        })

                                    }}
                                />
                                <Text style={styles.subText}>
                                {getLanguage(global.language).Analyst_Labels.REGISTRATION_SAMPLE_MODE_BILINEARITY}
                                </Text>
                            </View>
                            <View style={styles.subItem}>
                                <CheckBox
                                    style={{
                                    flex: 1,
                                    height: scaleSize(30),
                                    width: scaleSize(30),
                                    }}
                                    checked={this.state.data.SampleMode&&this.state.data.SampleMode ==2}
                                    onChange={value => {
                                        let _data = this.state.data
                                        if(value){
                                            _data.SampleMode = 2
                                        }else{
                                            _data.SampleMode = -1
                                        }
                                        this.setData({
                                            data:_data
                                        })

                                    }}
                                />
                                <Text style={styles.subText}>
                                {getLanguage(global.language).Analyst_Labels.REGISTRATION_SAMPLE_MODE_CUBIC_SONVOLUTION}
                                </Text>
                            </View>
                        </View>
                    </View>


                    <View style={styles.item}>
                        <Text style={styles.titelText}>
                            {getLanguage(global.language).Analyst_Labels.REGISTRATION_SAMPLE_PIXEL+':'}
                        </Text>
                        <TextInput
                            underlineColorAndroid={'transparent'}
                            onChangeText={text => {
                                let _data = this.state.data
                                _data.cellSize = this.clearNoNum(text)
                                this.setState({
                                    data: _data,
                                  })
                            }}
                            value={this.state.value + ''}
                            style={styles.input}
                            keyboardType={'number-pad'}
                        />
                    </View> */}

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: scaleSize(30),
              height: scaleSize(60),
            }}
          >
            <Text
              style={{
                fontSize: size.fontSize.fontSizeXl,
                height: scaleSize(32),
                color: color.black,
              }}
            >
              {getLanguage(global.language).Analyst_Labels
                .REGISTRATION_SAMPLE_PIXEL + ':'}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'transparent',
                margin: scaleSize(40),
              }}
            >
              <View
                style={{
                  paddingHorizontal: scaleSize(15),
                  paddingVertical: scaleSize(1),
                  height: scaleSize(60),
                  marginRight: scaleSize(150),
                  ...Platform.select({
                    android: {
                      padding: 0,
                    },
                  }),
                  borderWidth: 1,
                  borderRadius: scaleSize(8),
                  flexDirection: 'row',
                  flex: 3,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <TextInput
                  style={{
                    fontSize: size.fontSize.fontSizeXl,
                    color: color.black,
                    // width: scaleSize(150),
                    width: '100%',
                    marginRight: scaleSize(50),
                  }}
                  value={this.state.data.cellSize}
                  // editable={this.data.checked}
                  onChangeText={text => {
                    // let _cellSize = Number(text.replace(/[^0-9]*/g, ''))
                    let _cellSize = this.clearNoNum(text)
                    let _data = this.state.data
                    _data.cellSize = _cellSize
                    this.setState({
                      data: _data,
                    })
                  }}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: scaleSize(30),
              height: scaleSize(240),
            }}
          >
            <Text
              style={{
                fontSize: size.fontSize.fontSizeXl,
                height: scaleSize(32),
                color: color.black,
              }}
            >
              {getLanguage(global.language).Analyst_Labels
                .REGISTRATION_SAMPLE_MODE + ':'}
            </Text>
            {/* <View style={styles.item}> */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'transparent',
                margin: scaleSize(40),
              }}
            >
              <RadioGroup
                data={[
                  {
                    title: getLanguage(global.language).Analyst_Labels
                      .REGISTRATION_SAMPLE_MODE_NEAR,
                    value: 0,
                  },
                  {
                    title: getLanguage(global.language).Analyst_Labels
                      .REGISTRATION_SAMPLE_MODE_BILINEARITY,
                    value: 1,
                  },
                  {
                    title: getLanguage(global.language).Analyst_Labels
                      .REGISTRATION_SAMPLE_MODE_CUBIC_SONVOLUTION,
                    value: 2,
                  },
                ]}
                column={1}
                getSelected={this.getType}
              />
            </View>
          </View>
        </View>
      </View>
    )
  }

  render() {
    return (
      <PopView
        ref={ref => (this.PopView = ref)}
        style={styles.containerSampleMode}
      >
        <View
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: color.white,
          }}
        >
          {/* <KeyboardAvoidingView
            enabled={true}
            keyboardVerticalOffset={0}
            style={{ flex: 1 }}
            contentContainerStyle={{
              flex: 1,
              alignItems: 'center',
              flexDirection: 'column',
            }}
            behavior={Platform.OS === 'ios' && 'position'}
          > */}
          {this.renderContentView()}
          {/* </KeyboardAvoidingView> */}
        </View>
      </PopView>
    )
  }
}

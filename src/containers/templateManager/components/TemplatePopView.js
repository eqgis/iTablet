/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
 */
import * as React from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  SectionList,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { PopView, ListSeparator } from '../../../components'
import TemplateItem from './TemplateItem'
import { scaleSize, Toast } from '../../../utils'
import { size, color } from '../../../styles'
import { getLanguage } from '../../../language'
import NavigationService from '../../NavigationService'
import { SMap } from 'imobile_for_reactnative'

const styles = StyleSheet.create({
  btnsView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scaleSize(50),
    height: scaleSize(80),
  },
  btnView: {
    flex: 1,
    flexDirection: 'row',
    height: scaleSize(80),
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: size.fontSize.fontSizeMd,
    color: color.fontColorBlack,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  list: {
    backgroundColor: color.itemColorWhite,
  },
  popView: {
    backgroundColor: color.bgW,
  },
  sectionView: {
    backgroundColor: color.bgW,
  },
  subTitleView: {
    flexDirection: 'row',
    height: scaleSize(60),
    marginHorizontal: scaleSize(30),
    justifyContent: 'flex-start',
    alignItems: 'center',
    // backgroundColor: color.bgW,
    backgroundColor: 'transparent',
  },
  subTitle: {
    fontSize: size.fontSize.fontSizeMd,
    color: color.fontColorGray,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
})

export default class TemplatePopView extends React.Component {
  props: {
    language?: String, // 语言，用于根据当前语言设置按钮Title
    confirm: () => {}, // 自定义确定事件
    cancel: () => {}, // 自定义取消事件
    confirmTitle?: String, // 自定义确定Title
    cancelTitle?: String, // 自定义取消Title
    data: Array, // 数据
    height?: number, // PopView高度
    itemOnPress?: () => {}, // 自定义点击Item事件
  }

  static defaultProps = {
    data: [],
    height: -1,
  }

  constructor(props) {
    super(props)

    this.state = {
      data: props.data,
    }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return (
  //     this.props.language !== nextProps.language ||
  //     JSON.stringify(this.props) !== JSON.stringify(nextProps) ||
  //     JSON.stringify(this.state) !== JSON.stringify(nextState)
  //   )
  // }

  componentDidUpdate(prevProps) {
    if (JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data)) {
      this.setState({
        data: this.props.data,
      })
    }
  }

  setVisible = (visible, cb) => {
    this.popModal && this.popModal.setVisible(visible, cb)
  }

  _renderSectionHeader = ({ section }) => {
    return (
      <View style={styles.subTitleView}>
        <Text style={styles.subTitle}>{section.title}</Text>
      </View>
    )
  }

  _renderItem = ({ item, index, section }) => {
    let title = '',
      value = ''
    if (item.caption !== undefined) {
      title = item.caption
    } else if (item.name !== undefined) {
      title = item.name
    }
    if (item.value !== undefined) {
      value = item.value
    } else if (item.defaultValue !== undefined) {
      value = item.defaultValue
    }
    return (
      <TemplateItem
        title={title}
        value={value}
        rightType={item.rightType}
        rightStyle={
          index === section.data.length - 1 && { borderBottomWidth: 0 }
        }
        inputStyle={{ flex: 1 }}
        onPress={async () => {
          if (
            this.props.itemOnPress &&
            typeof this.props.itemOnPress === 'function'
          ) {
            this.props.itemOnPress &&
              this.props.itemOnPress({ item, index, section })
            return
          }
          if (
            item.name ===
              getLanguage(this.props.language).Map_Settings.DATASETS &&
            !this.state.data[1].data[0].value
          ) {
            Toast.show(
              getLanguage(this.props.language).Analyst_Prompt
                .SELECT_DATA_SOURCE_FIRST,
            )
            return
          }
          if (
            item.name ===
            getLanguage(this.props.language).Map_Settings.DATASOURCES
          ) {
            NavigationService.navigate('TemplateSource', {
              type: 'datasource',
              cb: ({ data, type }) => {
                let newData = JSON.parse(JSON.stringify(this.state.data))
                // 数据源更改时，清除数据集和属性
                if (data.alias !== this.state.data[1].data[0].value) {
                  newData[1].data[1].value = ''
                  newData[2].data = []
                }

                newData[1].data[0].data = data
                newData[1].data[0].value = data.alias
                this.setState({
                  data: newData,
                })
              },
            })
          } else if (
            item.name === getLanguage(this.props.language).Map_Settings.DATASETS
          ) {
            let datasourceAlias = this.state.data[1].data[0].value
            NavigationService.navigate('TemplateSource', {
              type: 'dataset',
              datasource: { alias: datasourceAlias },
              cb: async ({ data, type }) => {
                let newData = JSON.parse(JSON.stringify(this.state.data))
                newData[1].data[1].type = data.datasetType
                newData[1].data[1].value = data.datasetName

                // TODO 获取数据集属性
                let fieldInfos = await SMap.getFieldInfos({
                  alias: datasourceAlias,
                  datasetName: data.datasetName,
                })
                let fields = []
                fieldInfos.map(item => {
                  if (!item.isSystemField) {
                    item.rightType = 'input'
                    fields.push(item)
                  }
                })
                newData[2].data = fields

                this.setState({
                  data: newData,
                })
              },
            })
          }
        }}
        onChangeText={text => {
          if (item.value !== undefined) {
            item.value = text
          } else if (item.defaultValue !== undefined) {
            item.defaultValue = text
          }
        }}
      />
    )
  }

  renderList = () => {
    return (
      <SectionList
        style={styles.list}
        ref={ref => (this.ref = ref)}
        renderSectionHeader={this._renderSectionHeader}
        renderItem={this._renderItem}
        sections={this.state.data}
        keyExtractor={item => item.name}
        SectionSeparatorComponent={_props => {
          if (
            !_props.trailingItem &&
            _props.leadingItem &&
            _props.trailingSection
          ) {
            return (
              <View
                style={{
                  backgroundColor: color.separateColorGray,
                  flex: 1,
                  height: 10,
                }}
              />
            )
          }
          return <View />
        }}
      />
    )
  }

  renderBottom = () => {
    return (
      <View style={[styles.btnsView, { width: '100%' }]}>
        <TouchableOpacity
          style={[styles.btnView, { justifyContent: 'flex-start' }]}
          onPress={() => {
            this.popModal && this.popModal.setVisible(false)
            if (this.props.cancel && typeof this.props.cancel === 'function') {
              this.props.cancel()
            }
          }}
        >
          <Text style={styles.btnText}>
            {this.props.cancelTitle ||
              getLanguage(this.props.language || GLOBAL.language).Analyst_Labels
                .CANCEL}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btnView, { justifyContent: 'flex-end' }]}
          onPress={() => {
            if (
              this.props.confirm &&
              typeof this.props.confirm === 'function'
            ) {
              this.props.confirm(this.state.data)
            }
          }}
        >
          <Text style={styles.btnText}>
            {this.props.confirmTitle ||
              getLanguage(this.props.language || GLOBAL.language).Analyst_Labels
                .CONFIRM}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <PopView ref={ref => (this.popModal = ref)}>
        <KeyboardAvoidingView
          enabled={true}
          keyboardVerticalOffset={0}
          behavior={Platform.OS === 'ios' && 'padding'}
        >
          <View
            style={[
              styles.popView,
              // { width: '100%' },
              this.props.height >= 0 && { height: this.props.height },
            ]}
          >
            {this.renderBottom()}
            {this.renderList()}
          </View>
        </KeyboardAvoidingView>
      </PopView>
    )
  }
}

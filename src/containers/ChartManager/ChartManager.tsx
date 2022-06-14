import React, { Component } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  Platform,
  KeyboardAvoidingView,
} from 'react-native'
import { Container } from '../../components'
import { MainStackScreenRouteProp } from '../../types'
import { AppStyle, dp, Toast, setSpText, scaleSize , AppToolBar} from '../../utils'
import { getPublicAssets } from '../../assets'
import { getLanguage } from '../../language'
import ChartColorSet from './ChartColorSet'
import { RootState } from '../../redux/types'
import { connect, ConnectedProps } from 'react-redux'
import { SARMap } from 'imobile_for_reactnative'
import ToolbarModule from '../../containers/workspace/components/ToolBar/modules/ToolbarModule'
import { arEditModule } from '../../containers/workspace/components/ToolBar/modules'
import { ConstToolType } from '@/constants'

interface Props extends ReduxProps{
  // navigation: MainStackScreenNavigationProp<'ChartManager'>
  route: MainStackScreenRouteProp<'ChartManager'>
}
interface State {
  /** 数据 */
  data: Array<ItemType>,
  /** 属性字段的个数 */
  length: number | string,
  /** 颜色设置面板显隐标识 true：显示  false：隐藏 */
  isColorSetShow: boolean,
  /** 图表单位 */
  unit: string
}


interface ItemType {
  name: string,
  value: number | string,
  color: string,
}

interface ListRenderItemInfo {
  item: ItemType
  index: number
}


class ChartManager extends Component<Props, State> {
  // 类全局变量声明

  // 列表项的数量
  lastLength: number
  // 当前点击的列表项索引
  curIndex: number
  // 颜色设置面板的句柄
  // colorSetRef: typeof ChartColorSet | null

  constructor(props: Props){
    super(props)
    this.state = {
      data: [],
      length: 3,
      isColorSetShow: false,
      unit: '',
    }

    // 类全局变量初始化
    this.lastLength = 0
    this.curIndex = -1
    // this.colorSetRef = null

  }

  componentDidMount = async () => {
    let data: Array<ItemType> = []
    let unit = ""
    const type: string | undefined = this.props.route.params?.type
    // 判断是否是修改状态
    if(type === 'update'){
      // 是柱状图 修改状态，就获取数据作为页面的初始化数据
      // const layer01 = this.props.arMapInfo?.currentLayer
      // const element = AppToolBar.getData().selectARElement
      const layer = ToolbarModule.getParams()?.arlayer.currentLayer
      const element = ToolbarModule.getData().selectARElement

      console.warn("layer: " + layer.name + " - " + layer.t)
      if(layer && element){
        const charData = await SARMap.getBarChartData(layer?.name, element?.id)
        data = charData.data
        unit = charData.unit
      }
    } else if(type === 'pieChartUpdate'){
      // 饼图 更新状态，就获取饼图的数据作为页面的初始化数据
      // const layer = this.props.arMapInfo?.currentLayer
      // const element = AppToolBar.getData().selectARElement
      const layer = ToolbarModule.getParams()?.arlayer.currentLayer
      const element = ToolbarModule.getData().selectARElement
      if(layer && element){
        data = await SARMap.getPieChartData(layer?.name, element?.id)
      }
    } else {
      // 没有状态，默认新增状状态就是，使用默认的数据作为页面渲染的初始数据
      data = [
        {name:"item1", value: '100', color: COLORS[0]},
        {name:"item2", value: '100', color: COLORS[1]},
        {name:"item3", value: '100', color: COLORS[2]},
      ]
    }

    const length = data.length
    // 将原生拿回的数据做处理，只显示两位小数
    // for(let i = 0; i < length; i ++){
    //   // const value = Number(data[i].value).toFixed(2) + ""
    //   const temp = data[i].value + ""
    //   // if(temp.indexOf('.') === -1) continue
    //   const numberFloat =Number( Number(temp).toFixed(2))
    //   let value: number | string = parseInt(temp)
    //   if(numberFloat > value ){
    //     value = numberFloat
    //   }
    //   data[i].value = value + ""
    // }

    this.lastLength = length
    this.setState({data, length, unit})
  }

  /** 页面头部右侧的确定按钮功能 */
  _confirm = async () => {
    const type: string | undefined = this.props.route.params?.type
    if(type === 'update'){
      // 当type为柱状图更新时，就调用更新的方法，并退出这个界面
      // const layer = this.props.arMapInfo?.currentLayer
      // const element = AppToolBar.getData().selectARElement
      const layer = ToolbarModule.getParams()?.arlayer.currentLayer
      const element = ToolbarModule.getData().selectARElement
      if(layer && element){
        const chartData = {
          data: this.state.data,
          unit: this.state.unit
        }
        await SARMap.updateBarChart(layer.name, chartData, element.id)
      }
      this.props.navigation.goBack()
    }else if(type === 'pieChartAdd'){
      // 饼图添加
      const chartData = {
        data: this.state.data,
        unit: this.state.unit
      }
      // AppToolBar.addData({chartData})
      // AppToolBar.show('ARMAP_ADD', 'AR_MAP_ADD_PIE_CHART')
      arEditModule().setModuleData(ConstToolType.SM_AR_DRAWING_ADD_PIE_CHART)
      global.toolBox.setVisible(true, ConstToolType.SM_AR_DRAWING_ADD_PIE_CHART, {
        isFullScreen: false,
      })
      ToolbarModule.addData({chartData})

      // 退出页面（不退出就看不到工具栏）
      this.props.navigation.goBack()
    }else if(type === 'pieChartUpdate'){
      // 饼图更新
      // const layer = this.props.arMapInfo?.currentLayer
      // const element = AppToolBar.getData().selectARElement
      const layer = ToolbarModule.getParams()?.arlayer.currentLayer
      const element = ToolbarModule.getData().selectARElement
      if(layer && element){
        await SARMap.updatePieChart(layer.name, this.state.data, element.id)
      }
      this.props.navigation.goBack()
    } else {
      // type没有时，是柱状图新建状态，转到新建柱状图工具栏
      const chartData = {
        data: this.state.data,
        unit: this.state.unit
      }
      // AppToolBar.addData({chartData})
      // AppToolBar.show('ARMAP_ADD', 'AR_MAP_ADD_CHART')

      arEditModule().setModuleData(ConstToolType.SM_AR_DRAWING_ADD_BAR_CHART)
      global.toolBox.setVisible(true, ConstToolType.SM_AR_DRAWING_ADD_BAR_CHART, {
        isFullScreen: false,
      })
      ToolbarModule.addData({chartData})
      // 退出页面（不退出就看不到工具栏）
      this.props.navigation.goBack()
    }
  }

  _changeItemName = (index: number, text: string) => {
    if(text === '') {
      return
    }
    const data = JSON.parse(JSON.stringify(this.state.data))
    data[index].name = text
    this.setState({
      data,
    })
  }

  _changeItemValue = (index: number, text: string) => {
    let number = Number(text)
    if (isNaN(Math.round(number))) {
      number = 0
    }
    const data = JSON.parse(JSON.stringify(this.state.data))
    data[index].value = number + "" // .toFixed(2)
    this.setState({
      data,
    })
  }

  /** 改变颜色的方法 */
  _pressColor = (index: number) => {
    if(!this.state.isColorSetShow){
      // 更新当前点击的列表项
      this.curIndex = index
      // 显示颜色设置面板
      this.setState({isColorSetShow: true})
    }

  }

  /** 颜色设置方法 */
  colorSet = (color: string) => {
    const data = JSON.parse(JSON.stringify(this.state.data))
    data[this.curIndex].color = color

    // 将当前索引改为什么也未选中  写了报错
    // this.curIndex = -1
    // 修改值，以及关闭颜色设置面板
    this.setState({
      data,
      isColorSetShow: false,
    })
  }

  onClose = () => {
    this.setState({
      isColorSetShow: false,
    })
  }

  /** 页面头 */
  renderHeader = () => {
    const type: string | undefined = this.props.route.params?.type
    let pageTitle = getLanguage().Common.HISTOGRAM_ATTRIBUTE
    if(type === 'pieChartUpdate' || type === 'pieChartAdd'){
      pageTitle = getLanguage().Common.PIE_CHART_ATTRIBUTE
    }
    return (
      <View style={{
        height: dp(60),
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: AppStyle.Color.Background_Page,
        paddingHorizontal: dp(20),
        borderBottomWidth: dp(1),
        borderBottomColor: AppStyle.Color.Seperator,
        marginBottom: dp(12),
      }}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            maxWidth: '60%'
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.goBack()
            }}
          >
            <Image
              style={{
                width: dp(30),
                height:dp(30)
              }}
              source={getPublicAssets().common.icon_back}
            />
          </TouchableOpacity>
          <Text
            style={AppStyle.Text_Style_Center}
            numberOfLines={1}
          >
            {pageTitle}
          </Text>
        </TouchableOpacity>
        {this.renderHeaderRight()}
      </View>
    )
  }

  /** 页面头部右侧的确定按钮 */
  renderHeaderRight = () => {
    return (
      <View style={{
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
      }}>
        <TouchableOpacity
          style={{
            marginHorizontal: dp(10),
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={this._confirm}
        >
          <Text style={styles.rightText}>{getLanguage().Common.CONFIRM}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  /** 增删列表数据 length: number 表示目标数量 */
  _changeLength = (length:number | string) => {
    if(typeof(length) === 'string'){
      length = Number(length)
    }
    if (isNaN(Math.round(length)) || length.toString().includes('.') || length < 3) {
      Toast.show(getLanguage().Common. ONLY_GRATER_THAN_TWO) // 只能输入大于2的整数
      return
    }
    const data = JSON.parse(JSON.stringify(this.state.data)) as ItemType[]

    // 上一次的数量 - 目标数量
    const minusRel = this.lastLength - length
    // 差值为正，数量减少，删除
    if (minusRel > 0) {
      data.splice(this.lastLength- minusRel, minusRel)
    } else {
      // 差值为负，数量增加，添加
      for (let i = 0; i < Math.abs(minusRel); i++) {
        const index = data.length - 1
        // 名字随机  10个预置色
        // const name = 'temp' + Math.round(Math.random() * 100 + 1)
        const name = 'item' + (data.length + 1)
        const value = data[index].value
        // const color = data[index].color
        const color = COLORS[(data.length % COLORS.length)]
        // 添加一个对象
        const newObj = {name, value, color}
        data.splice(this.lastLength, 0, newObj)
        this.lastLength = data.length
      }
    }
    this.lastLength = ~~length
    this.setState({
      data,
      length: ~~length,
    })
  }

  _renderLeft = () => {
    const type: string | undefined = this.props.route.params?.type
    let renderComponent = <></>
    // 当类型时饼图的操作时，就显示“数量”文字
    if(type === 'pieChartUpdate' || type === 'pieChartAdd') {
      renderComponent =  <Text style={styles.itemTitle}>
        {getLanguage().Common.COUNT}
      </Text>
    } else {
      // 当类型是柱状图的操作时，就显示单位设置的输入框
      renderComponent =  <View style={[styles.itemTitle,{
        flexDirection: 'row',
      }]}>
        <Text>
          {getLanguage().Common.UNIT}
        </Text>
        <TextInput
          value={this.state.unit + ''}
          style={[styles.constText, styles.normalText, styles.itemInputStyle,{ marginLeft: dp(10)}]}
          onChangeText={(text: string) => {
            this.setState({
              unit: text,
            })
          }}
          // onEndEditing={evt => {
          // }}
        />
      </View>
    }

    return renderComponent
  }

  _renderInput = () => {
    const minus = require('../../assets/mapTool/icon_minus.png')
    const plus = require('../../assets/mapTool/icon_plus.png')
    const length = this.state.length
    return (
      <View style={styles.row}>
        {this._renderLeft()}

        <View style ={styles.inputContainer}>
          <View style={styles.inputView}>
            {/* 减按钮 */}
            <TouchableOpacity
              style={styles.minus}
              onPress={() => {
                this._changeLength(Number(this.state.length) - 1)
              }}
            >
              <Image style={styles.icon} source={minus} resizeMode={'contain'} />
            </TouchableOpacity>
            {/* 显示框 */}
            <TextInput
              defaultValue={length + ''}
              value={this.state.length + ''}
              style={styles.inputItem}
              keyboardType={'number-pad'}
              returnKeyType={'done'}
              onChangeText={(text: string) => {
                let length: number | string
                if (text === '') {
                  length = ''
                } else if (isNaN(Number(text)) || isNaN(Math.round(Number(text))) || text.includes('.')) {
                  length = Number(this.state.length)
                } else {
                  length = parseInt(text)
                }
                this.setState({
                  length,
                })
              }}
              onEndEditing={(evt:TextInput) => {
                const text = evt.nativeEvent.text
                let length = 3
                if (Number(text) < 3) {
                  length = 3
                } else {
                  length = parseInt(text)
                }
                this.setState({
                  length,
                }, () => {
                  this._changeLength(length)
                })
              }}
            />
            {/* 加按钮 */}
            <TouchableOpacity
              style={styles.plus}
              onPress={() => {
                this._changeLength(Number(this.state.length) + 1)
              }}
            >
              <Image style={styles.icon} source={plus} resizeMode={'contain'} />
            </TouchableOpacity>
          </View>
        </View>

      </View>
    )
  }

  /** 列表的表头 */
  renderListHeader(){
    return (
      <View
        style={{
          marginTop: scaleSize(10),
          backgroundColor: '#fff',}}
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.itemRow}>
            <View style={[styles.left, {justifyContent: 'flex-start'}]}>
              <Text style={[styles.titleText, {marginLeft: scaleSize(30)}]}>{getLanguage().Common.ATTR_NAME}</Text>
            </View>
            <View style={[styles.left, {justifyContent: 'flex-start'}]}>
              <Text style={styles.titleText}>{getLanguage().Common.VALUE}</Text>
            </View>
            <View style={[styles.left, {justifyContent: 'center'}]}>
              <Text style={styles.titleText}>{getLanguage().Common.COLOR}</Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    )
  }

  /** item: ItemType   index: number */
  _renderItem = ({ item, index }: ListRenderItemInfo) => {
    const name = item.name
    const value = item.value
    // const color = `rgb(${item.color.r},${item.color.g},${item.color.b})`
    const color = item.color
    return (
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.itemRow}>
          <View style={[styles.left, {justifyContent: 'flex-start'}]}>
            {/* <Text style={styles.constText}>{name}</Text> */}
            <TextInput
              value={name + ''}
              style={[styles.constText, styles.normalText, styles.itemInputStyle]}
              // keyboardType={'number-pad'}
              // returnKeyType={'done'}
              onChangeText={(text: string) => {
                const data = JSON.parse(JSON.stringify(this.state.data))
                data[index].name = text
                this.setState({
                  data,
                })
              }}
              onEndEditing={(evt:TextInput) => {
                this._changeItemName(index, evt.nativeEvent.text)
              }}
            />
          </View>
          <View style={[styles.left, {justifyContent: 'flex-start'}]}>
            {/* <Text style={styles.constText}>{str}</Text> */}
            <TextInput
              value={value + ''}
              style={[styles.normalText, styles.itemInputStyle]}
              keyboardType={'number-pad'}
              returnKeyType={'done'}
              onChangeText={(text: string) => {
                const data = JSON.parse(JSON.stringify(this.state.data))
                data[index].value = text
                this.setState({
                  data,
                })
              }}
              onEndEditing={(evt:TextInput) => {
                this._changeItemValue(index, evt.nativeEvent.text)
              }}
            />
          </View>
          <View style={[styles.left, {justifyContent: 'center'}]}>
            <TouchableOpacity
              style={[styles.right, { backgroundColor: color }]}
              activeOpacity={1}
              onPress={() => {
                this._pressColor(index)
              }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    )
  }

  render(){
    return (
      <Container
        style={styles.container}
        header={this.renderHeader()}
      >
        <View style={styles.pageContainer}>
          {this._renderInput()}
          {this.renderListHeader()}
          {/* <ScrollView  style={styles.list}> */}
          <FlatList
            style={styles.list}
            keyExtractor={(item: ItemType, index: number) => item.toString() + index}
            data={this.state.data}
            renderItem={this._renderItem}
          />
          {/* </ScrollView> */}

          {this.state.isColorSetShow &&
            <View style={styles.colorSet}>
              <ChartColorSet
                // ref={ref => this.colorSetRef = ref}
                color={this.state.data[this.curIndex].color}
                colorSet={this.colorSet}
                onClose={this.onClose}
              />
            </View>
          }
        </View>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEEEEE',
  },
  rightText: {
    fontSize: setSpText(20),
    color: '#181818',
  },
  pageContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    marginTop: scaleSize(-10),
    paddingHorizontal: scaleSize(10),
    height: scaleSize(80),
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  icon: {
    width: scaleSize(40),
    height: scaleSize(40),
    tintColor: '#181818',
  },
  itemTitle: {
    paddingLeft: scaleSize(38),
    fontSize: setSpText(18),
    flex: 3,
  },
  inputContainer:{
    flex:1,
    justifyContent: 'flex-end'
  },
  inputView: {
    width: scaleSize(100),
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  inputItem: {
    textAlign: 'center',
    width: scaleSize(60),
    height: scaleSize(40),
    fontSize: setSpText(16),
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(59,55,56,0.1)',
    backgroundColor: '#fff',
    ...Platform.select({
      android: {
        padding: 0,
      },
    }),
  },
  plus: {
    width: scaleSize(40),
    height: scaleSize(40),
    borderWidth: 1,
    borderColor: 'rgba(59,55,56,0.1)',
    backgroundColor: '#fff',
  },
  minus: {
    width: scaleSize(40),
    height: scaleSize(40),
    borderWidth: 1,
    borderColor: 'rgba(59,55,56,0.1)',
    backgroundColor: '#fff',
  },
  /** list */
  list: {
    marginTop: scaleSize(1),
    flex: 1,
    backgroundColor: '#fff',
  },
  itemRow: {
    height: scaleSize(80),
    marginHorizontal: scaleSize(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    width: scaleSize(120),
    height: scaleSize(40),
  },
  titleText: {
    width: scaleSize(120),
    textAlign: 'center',
    fontSize: scaleSize(25),
    color: '#000'
  },
  constText: {
    marginLeft: scaleSize(40),
    fontSize: scaleSize(18),
  },
  normalText: {
    fontSize: scaleSize(18),
    width: scaleSize(120),
    height: scaleSize(40),
    textAlign: 'center',
    ...Platform.select({
      android: {
        padding: 0,
      },
    }),
  },
  itemInputStyle: {
    borderColor: 'rgba(59,55,56,0.1)',
    borderWidth: 1,
    padding: dp(5),
  },
  colorSet: {
    // flex: 1,
    height: scaleSize(200),
    // backgroundColor: '#aecef5',
    paddingTop: scaleSize(10),
  },
})

const COLORS = [
  '#808880',
  '#e3a1b1',
  '#aecef5',
  '#6BB4D1',
  '#FDFEEC',
  '#FFD055',
  '#FF8F59',
  '#D6FEDF',
  '#85EBB3',
  '#60103E',
  '#A16F99',
  '#3F529B',
]


const mapStateToProp = (state: RootState) => ({
  arMapInfo: state.arlayer.mapInfo,
  // currentUser: state.user.currentUser
})

const mapDispatch = {
}

type ReduxProps = ConnectedProps<typeof connector>
const connector = connect(mapStateToProp, mapDispatch)

export default connector(ChartManager)

// export default ChartManager
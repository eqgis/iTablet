import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScaledSize,
  Dimensions,
} from 'react-native'
import { scaleSize } from '../../utils'
import { getThemeAssets } from '../../assets'
import { getLanguage } from '../../language'
import ToolbarColor from 'imobile_for_reactnative/components/ToolbarKit/component/ToolbarColor'
import { RootState } from '../../redux/types'
import { connect} from 'react-redux'


export interface ToolbarColorOption {
  colors: string[]
  initColor?: string
  onSelect: (color: string) => void
}
interface Props {
  color: string
  // 调用父组件的颜色设置方法
  colorSet: (color: string) => void
  onClose: () => void
  windowSize: ScaledSize
  // data: any
  // index: number
}

interface CommonProps {
  title: string
  onPress?: (index: number) => void
}

interface TabColor extends CommonProps {
  type: 'color'
  data: ToolbarColorOption
}
interface State {
  /** 修改后的目标颜色 */
  color: string
  // data:ToolbarTabItem
  data: TabColor
}



class ChartColorSet extends Component<Props, State> {
  // colorItemRef: TabItemColor | null = null
  colorItemRef: ToolbarColor | null = null
  constructor(props: Props) {
    super(props)
    this.state = {
      color: this.props.color,
      data: {
        title: getLanguage().ARMap.COLOR,
        type: 'color',
        data: {
          colors: COLORS,
          initColor: this.props.color,
          onSelect: (color) => {
            this.updateColor(color)
          }
        }
      },
    }
  }
  /** 颜色设置 */
  colorSet = () => {
    const color = this.state.color
    this.props.colorSet(color)
    this.setState({
      color,
    })
  }

  /** 关闭颜色设置面板 */
  onClose = () => {
    this.props.onClose && this.props.onClose()
  }

  // 修改预览颜色
  updateColor = (color: string) => {
    this.setState({
      color,
    })
  }

  _renderHeader = () => {
    return (
      <View style={styles.headerView}>
        {/* 关闭按钮 */}
        <TouchableOpacity
          style={styles.headerButton}
          onPress={this.onClose}
        >
          <Image style={styles.iconSize} source={getThemeAssets().toolbar.icon_toolbar_quit}/>
        </TouchableOpacity>
        {/* 确定按钮 */}
        <TouchableOpacity
          style={styles.headerButton}
          onPress={this.colorSet}
        >
          <Image style={styles.iconSize} source={getThemeAssets().toolbar.icon_toolbar_submit}/>
        </TouchableOpacity>

      </View>
    )
  }

  renderColor = () => {
    return (
      <View style={styles.colorView}>
        <ToolbarColor
          ref={ref => this.colorItemRef = ref}
          toolbarVisible={true}
          animation={false}
          data={this.state.data.data}
          // windowSize={Dimensions.get('window')}
          windowSize={this.props.windowSize}
          isNotToolBar={true}
        />
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderColor()}
        {this._renderHeader()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerView: {
    width: '100%',
    height: scaleSize(60),
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center',
    paddingLeft: scaleSize(44),
  },
  headerButton: {
    width: scaleSize(80),
    height: scaleSize(40),
    textAlign: 'center',
    fontSize: scaleSize(16),
    color: '#333',
  },
  iconSize: {
    width: scaleSize(40),
    height: scaleSize(40),
  },

  colorView: {
    paddingTop: scaleSize(20),
    marginLeft: scaleSize(-20),
  },

})

const COLORS = [
  '#FFFFFF',
  '#000000',
  '#F0EDE1',
  '#1E477C',
  '#4982BC',
  '#00A1E9',
  '#803000',
  '#BD5747',
  '#36E106',
  '#9CBB58',
  '#8364A1',
  '#4AADC7',
  '#F89746',
  '#E7A700',
  '#E7E300',
  '#D33248',
  '#F1F1F1',
  '#7D7D7D',
  '#DDD9C3',
  '#C9DDF0',
  '#DBE4F3',
  '#BCE8FD',
  '#E5C495',
  '#F4DED9',
  '#DBE9CE',
  '#EBF4DE',
  '#E5E1ED',
  '#DDF0F3',
  '#FDECDC',
  '#FFE7C4',
  '#FDFACA',
  '#F09CA0',
  '#D7D7D7',
  '#585858',
  '#C6B797',
  '#8CB4EA',
  '#C1CCE4',
  '#7ED2F6',
  '#B1894F',
  '#E7B8B8',
  '#B0D59A',
  '#D7E3BD',
  '#CDC1D9',
  '#B7DDE9',
  '#FAD6B1',
  '#F5CE88',
  '#FFF55A',
  '#EF6C78',
  '#BFBFBF',
  '#3E3E3E',
  '#938953',
  '#548ED4',
  '#98B7D5',
  '#00B4F0',
  '#9A6C34',
  '#D79896',
  '#7EC368',
  '#C5DDA5',
  '#B1A5C6',
  '#93CDDD',
  '#F9BD8D',
  '#F7B550',
  '#FFF100',
  '#E80050',
  '#A6A6A7',
  '#2D2D2B',
  '#494428',
  '#1D3A5F',
  '#376192',
  '#825320',
  '#903635',
  '#13B044',
  '#76933C',
  '#5E467C',
  '#31859D',
  '#E46C07',
  '#F39900',
  '#B7AB00',
  '#A50036',
  '#979D99',
  '#0C0C0C',
  '#1C1A10',
  '#0C263D',
  '#005883',
  '#693904',
  '#622727',
  '#005E14',
  '#4F6028',
  '#3E3050',
  '#245B66',
  '#974805',
  '#AD6A00',
  '#8B8100',
  '#7C0022',
  '#F0DCBE',
  '#F2B1CF',
  '#D3FFBF',
  '#00165F',
  '#6673CB',
  '#006EBF',
  '#89CF66',
  '#70A900',
  '#93D150',
  '#70319F',
  '#D38968',
  '#FFBF00',
  '#FFFF00',
  '#C10000',
  '#F0F1A6',
  '#FF0000',
]

const mapStateToProp = (state: RootState) => ({
  windowSize: state.device.toJS().windowSize,
})

const mapDispatch = {

}

// type ReduxProps = ConnectedProps<typeof connector>
const connector = connect(mapStateToProp, mapDispatch)

export default connector(ChartColorSet)

// export default ChartColorSet
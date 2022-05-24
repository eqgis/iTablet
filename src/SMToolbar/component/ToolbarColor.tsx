import React from 'react'
import { View, ScrollView, StyleSheet, TouchableOpacity,Image,TextInput,Text} from 'react-native'
import { AppStyle, dp } from '../../utils'
import { getImage } from '../../assets'
import { ScaledSize } from 'react-native'
import ToolbarSlideCard from './ToolbarSlideCard'

export interface ToolbarColorOption {
  colors: string[]
  initColor?: string
  onSelect: (color: string) => void
}

interface IProps extends Partial<DefaultProps> {
  toolbarVisible: boolean
  data: ToolbarColorOption
  windowSize: ScaledSize
}

interface DefaultProps {
  animation: boolean
}

interface IState {
  selectColor: string
  addColor: boolean
  colors: string[]
}

const defaultProps: DefaultProps = {
  animation: true
}

export default class ToolbarColor extends React.Component<IProps & DefaultProps, IState> {

  static defaultProps = defaultProps

  r:string
  g:string
  b:string
  constructor(props: IProps & DefaultProps){
    super(props)
    this.state = {
      selectColor: props.data.initColor || props.data.colors[0],
      addColor: false,
      colors:this.props.data.colors
    }
    this.r = ''
    this.g = ''
    this.b = ''
  }

  isVisible = () => {
    return this.props.toolbarVisible && this.props.data.colors.length > 0
  }

  componentDidUpdate(prevProps: IProps & DefaultProps) {
    if(prevProps.data !== this.props.data) {
      this.updateData()
    }
  }

  updateData = () => {
    this.setState({
      selectColor: this.props.data.initColor || this.props.data.colors[0],
      addColor: false,
      colors:this.props.data.colors
    })
    this.r = ''
    this.g = ''
    this.b = ''
  }

  renderList = () => {
    const { selectColor } = this.state
    return (
      <View style={[styles.list, !this.isPortrait && {flexDirection: 'column', height: '100%'}]}>
        <View style={[styles.show, this.isPortrait?{
          marginLeft: dp(27),
          marginRight: dp(8),
        }:{
          marginTop: dp(27),
          marginBottom: dp(8),
        },
        { backgroundColor: selectColor }]}/>
        <ScrollView
          horizontal={this.isPortrait}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[this.isPortrait ? styles.listContainer :  styles.listContainerL]}
          >
            {this.state.colors.map((item: string, index: number) => {
              return (
                <TouchableOpacity
                  key={item}
                  onPress={() => {
                    this.setState({ selectColor: this.state.colors[index] })
                    this.props.data.onSelect(this.state.colors[index])
                  }}
                >
                  <View style={[
                    { backgroundColor: item },
                    this.isPortrait ? styles.item : styles.itemL
                    // index ===0 ? styles.firstPicker :( index === colors.length - 1 ? styles.lastPicker : {})
                  ]} />
                </TouchableOpacity>
              )
            })}

          </View>
        </ScrollView>

        <TouchableOpacity
          onPress={() => {
            this.setState({ addColor: true })
          }}
        >
          <View style={[
            styles.item,
            { alignItems: 'center', justifyContent: 'center', marginRight: dp(5) }
          ]} >
            <Image
              source={getImage().icon_add}
              style={AppStyle.Image_Style}
            />
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  renderAdd = () => {
    return (
      <View style={[styles.list, this.isPortrait ? {marginHorizontal:  dp(30)}: {flexDirection: 'column', height: '100%', paddingVertical: dp(30)}]}>
        <View style={{
          flex: 1, flexDirection: this.isPortrait ? 'row' : 'column',
          alignItems: 'center',
        }}>
          <Text style={{ ...AppStyle.h1, color: AppStyle.Color.GRAY }}>
            {"r: "}
          </Text>
          <TextInput
            style={{padding: 0, flex:1}}
            keyboardType={'numeric'}
            placeholderTextColor={AppStyle.Color.Text_Search}
            onChangeText={text => {
              this.r = text
            }}
          />
        </View>

        <View style={{
          flex: 1, flexDirection: this.isPortrait ? 'row' : 'column',
          alignItems: 'center',
        }}>
          <Text style={{ ...AppStyle.h1, color: AppStyle.Color.GRAY }}>
            {"g: "}
          </Text>
          <TextInput
            style={{ paddingVertical: dp(12),flex:1 }}
            keyboardType={'numeric'}
            placeholderTextColor={AppStyle.Color.Text_Search}
            onChangeText={text => {
              this.g = text
            }}
          />
        </View>

        <View style={{
          flex: 1, flexDirection: this.isPortrait ? 'row' : 'column',
          alignItems: 'center',
        }}>
          <Text style={{ ...AppStyle.h1, color: AppStyle.Color.GRAY }}>
            {"b: "}
          </Text>
          <TextInput
            style={{ paddingVertical: dp(12) ,flex:1}}
            keyboardType={'numeric'}
            placeholderTextColor={AppStyle.Color.Text_Search}
            onChangeText={text => {
              this.b = text
            }}
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            if(this.r !== '' && this.g !== '' && this.b !==''){
              const color = this.state.colors.concat(colorRGB2Hex("("+this.r+","+this.g+","+this.b+")"))
              this.setState({ colors: color })
              this.r = ''
              this.g = ''
              this.b = ''
            }
            this.setState({ addColor: false })
          }}
        >
          <View style={[
            styles.item,
            { alignItems: 'center', justifyContent: 'center', marginRight: dp(5) }
          ]} >
            <Image
              source={getImage().icon_submit}
              style={AppStyle.Image_Style_Small}
            />
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  isPortrait = true

  renderContent = () => {
    this.isPortrait = this.props.windowSize.height > this.props.windowSize.width
    return (
      <>
        {this.isPortrait ? (
          <View style={{height: dp(60)}}>
            {   this.state.addColor ? this.renderAdd() : this.renderList()}
          </View>
        ): (
          <View style={{width: dp(60)}}>
            {   this.state.addColor ? this.renderAdd() : this.renderList()}
          </View>
        )}
      </>
    )
  }

  render() {
    return this.props.animation ? (
      <ToolbarSlideCard visible={this.isVisible()}>
        {this.renderContent()}
      </ToolbarSlideCard>
    ) : this.renderContent()
  }
}

function colorRGB2Hex(color:string) {
  const rgb = color.split(',')
  const r = parseInt(rgb[0].split('(')[1])
  const g = parseInt(rgb[1])
  const b = parseInt(rgb[2].split(')')[0])

  const hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
  return hex
}


const styles = StyleSheet.create({
  list: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center'
  },
  listContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: AppStyle.Color.LIGHT_GRAY,
    height: dp(40),
    overflow: 'hidden',
  },
  listContainerL: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppStyle.Color.LIGHT_GRAY,
    width: dp(40),
    overflow: 'hidden',
  },
  item: {
    width: dp(24),
    height: dp(40),
  },
  itemL: {
    height: dp(24),
    width: dp(40),
  },
  show:{
    width: dp(40),
    height: dp(40),
    // borderRadius: dp(4),
    borderWidth: 1,
    borderColor: AppStyle.Color.LIGHT_GRAY,
  },
  firstPicker: {
    borderTopLeftRadius: dp(4),
    borderBottomLeftRadius: dp(4)
  },
  lastPicker: {
    borderTopRightRadius: dp(4),
    borderBottomRightRadius: dp(4)
  }
})
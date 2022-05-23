import React from 'react'
import { FlatList, Image, ListRenderItemInfo, ScaledSize, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import ToolbarSlideCard from '../ToolbarSlideCard'
import { getImage } from '../../../assets'
import {  AppLog, AppStyle, dp } from '../../../utils'
import ToolbarTabView, { ToolbarTabItem } from './ToolbarTabView'


export interface ToolbarTabOption {
  data: ToolbarTabItem[]
  /** 默认展示第几页 */
  defaultIndex?: number
  /** 是否显示显隐切换按钮 */
  isShowToggle?: boolean
  /** 是否显示view */
  isShowView?: boolean
}

interface Props {
  toolbarVisible: boolean
  option: ToolbarTabOption
  windowSize: ScaledSize
}

interface State {
  currentIndex: number
  isShowView: boolean
}

const TAB_PADDING = dp(0)

class ToolbarTabContainer extends React.Component<Props, State> {

  viewListRef: FlatList<ToolbarTabItem> | null = null

  viewRefs: ToolbarTabView[] = []

  constructor(props: Props) {
    super(props)

    const {isShowView = true, defaultIndex = 0} = this.props.option
    this.state = {
      currentIndex: defaultIndex,
      isShowView
    }
  }

  isVisible = (): boolean => {
    return this.props.toolbarVisible && this.props.option.data.length > 0
  }

  componentDidUpdate(prevProps: Props){
    if(prevProps.option !== this.props.option) {
      const {isShowView = true, defaultIndex = 0} = this.props.option
      this.setState({
        currentIndex: defaultIndex,
        isShowView
      })
    }
  }

  _scrollToIndex = (index: number, animated = true) => {
    try{
      this.isVisible() && this.viewListRef?.scrollToIndex({index, animated})
    }catch(e){
      AppLog.error(e)
    }
  }

  reset = () => {
    this.viewRefs.forEach(item => {
      item.reset()
    })
  }

  showTabView = (visible: boolean) => {
    this.setState({
      isShowView: visible
    })
  }

  renderTab = ({item, index}: ListRenderItemInfo<ToolbarTabItem>) => {
    if(!this.props.option) return null
    const { currentIndex } = this.state
    const length = this.props.option.data.length < 6 ? this.props.option.data.length : 5.5
    const width = (this.props.windowSize.width - TAB_PADDING * 2) / length
    const height = (this.props.windowSize.height - TAB_PADDING * 2) / length
    return (
      <TouchableOpacity
        style={[
          this.isPortrait ? {
            width: width,
          } : {
            height: height,
            maxWidth: dp(100),
          },
          {
            justifyContent: 'center',
            alignItems: 'center',
            padding: dp(5),
          }
        ]}
        onPress={()=>{
          if(currentIndex !== index) {
            this.setState({
              currentIndex: index,
            })
            this._scrollToIndex(index)
            item.onPress?.(index)
          }
        }}
      >
        <Text
          style={[
            AppStyle.h2c,
            styles.tabText,
            currentIndex === index ? styles.tabTextActive: {}
          ]}
          numberOfLines={this.isPortrait ? 2 : undefined}
        >
          {item.title}
        </Text>
      </TouchableOpacity>
    )
  }

  _renderTabs = () => {
    return (
      <View style={this.isPortrait ? styles.tabContainer : styles.ContainerL}>
        {this.props.option?.isShowToggle && (
          <TouchableOpacity
            style={this.isPortrait ?  {
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            } :  {
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={()=>{
              this.setState({isShowView: !this.state.isShowView})
            }}
          >
            <Image
              source={this.state.isShowView ? getImage().icon_drop_down: getImage().icon_drop_up}
              style={[AppStyle.Image_Style, !this.isPortrait &&(this.state.isShowView ? {
                transform: [{rotate: '270deg'}]
              }: {
                transform: [{rotate: '270deg'}]
              })]}
            />
          </TouchableOpacity>)
        }
        <FlatList
          data={this.props.option?.data || []}
          renderItem={this.renderTab}
          keyExtractor={item => item.title}
          horizontal={this.isPortrait}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
    )
  }

  _renderView = ({item, index}: ListRenderItemInfo<ToolbarTabItem>) => {
    return (
      <ToolbarTabView
        ref={ref => ref && this.viewRefs.push(ref)}
        visible={this.state.currentIndex === index}
        windowSize={this.props.windowSize}
        data={item}
      />
    )
  }

  _renderViews = () => {
    return (
      <FlatList
        ref={ref => this.viewListRef = ref}
        style={[
          !this.state.isShowView && (this.isPortrait ? { height: 0 } : { width: 0 })
        ]}
        data={this.props.option.data}
        renderItem={this._renderView}
        keyExtractor={(item, index) => index.toString()}
        horizontal={this.isPortrait}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        onLayout={() => {
          this._scrollToIndex(this.state.currentIndex, false)
        }}
      />
    )
  }

  isPortrait = true

  render() {
    this.isPortrait = this.props.windowSize.height > this.props.windowSize.width
    return(
      <ToolbarSlideCard
        visible={this.isVisible()}
        contentContainerStyle={this.isPortrait ? styles.Container : styles.ContainerL}
      >
        {this._renderTabs()}
        {this._renderViews()}
      </ToolbarSlideCard>
    )
  }
}

export default ToolbarTabContainer



const styles = StyleSheet.create({
  Container: {
    flexDirection: 'column'
  },
  ContainerL: {
    flexDirection: 'row',
    width: undefined
  },

  tabContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: TAB_PADDING,
  },
  tabContainerL: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: TAB_PADDING,
  },

  tabText: {
    borderBottomWidth: dp(2),
    borderBottomColor: 'transparent',
    color: '#999799',
  },
  tabTextActive: {
    color: AppStyle.Color.BLUE,
    borderBottomColor: AppStyle.Color.BLUE,
  },
})
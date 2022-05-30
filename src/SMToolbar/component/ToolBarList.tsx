import React from 'react'
import { ImageRequireSource, ScaledSize, ScrollView } from 'react-native'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { AppProgress, AppStyle, dp } from '../../utils'
import { LANDSCAPE_WIDTH } from './styles'
import ToolbarSlideCard from './ToolbarSlideCard'

/** toobar list 数据参数 */
export interface ToolBarListOption {
  data: ToolBarListItem[]
  /** list 一行显示 默认true */
  oneColumn?: boolean
  /** 是否显示当前选中项 默认false */
  showSelect?: boolean
  /** 动态获取其他数据，显示在 data 后面 */
  getExtraData?: () => Promise<ToolBarListItem[]>
}

export interface ToolBarListItem {
  image: ImageRequireSource
  disableImage?: ImageRequireSource, // 不可点击图片
  disable?: boolean,  // 是否可点击
  text?: string
  onPress: () => void
  /** 点击后下载识别key，用以监听进度 */
  downloadKeys?: string[]
}

interface Props {
  data: Array<ToolBarListItem>
  visible: boolean
  getExtraData?: () => Promise<ToolBarListItem[]>
  /** 一行显示 */
  oneColumn: boolean
  /** 底部显示状态 */
  showSelect: boolean
  /** 是否有动画 */
  animation: boolean
  windowSize: ScaledSize
}

interface UriType {
  uri: string
}

interface State {
  data: ToolBarListItem[]
   /** 当前是否隐藏 */
  isHide: boolean
  selectedIndex: number
}

/** 每行显示个数 */
const numOfRow = 5
/** 每个 item 高度 */
const itemHeight = dp(50)

class ToolBarList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      data: this.props.data,
      isHide: false,
      selectedIndex: 0
    }
  }

  componentDidMount() {
    this.updateData()
  }

  componentDidUpdate(prevProps: Props) {
    if(prevProps.visible !== this.props.visible
      || prevProps.data.length !== this.props.data.length
      || JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data)
      || prevProps.getExtraData !== this.props.getExtraData
    ) {
      this.updateData()
    }
  }

  reset = () => {
    this.updateData()
  }

  /** 切换显隐 */
  toggleHide = () => {
    this.setState({ isHide: !this.state.isHide})
  }

  updateData = async () => {
    let data: ToolBarListItem[] = []
    if(this.props.getExtraData) {
      data = await this.props.getExtraData()
    }
    this.setState({
      data: this.props.data.concat(data),
      isHide: false,
      // selectedIndex: 0,
    })
  }

  _getCurrentHeight = (): number => {
    if(this.props.oneColumn) {
      return (itemHeight + dp(10) * 2)
    }
    const length = this.state.data.length
    const rows = Math.ceil(length / numOfRow)
    return rows * (itemHeight + dp(10) * 2)
  }

  isVisible = (): boolean => {
    return this.props.visible && (this.props.data.length > 0 || this.props.getExtraData != undefined)
  }

  renderItem = (item: ToolBarListItem, index: number) => {
    return (
      <ListItem
        key={index}
        showSelect={this.props.showSelect}
        isSelected={index === this.state.selectedIndex}
        item={item}
        itemCounts={this.state.data.length}
        oneColumn={this.props.oneColumn}
        onSelect={() => {
          this.setState({
            selectedIndex: index,
          })
          item.onPress()
        }}
        windowSize={this.props.windowSize}
      />
    )
  }

  renderList = () => {
    const isPortrait = this.props.windowSize.height > this.props.windowSize.width
    const oneColumn = this.props.oneColumn
    return (
      <ScrollView
        contentContainerStyle={oneColumn  ? {
          justifyContent: 'space-around',
        }: {
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
        horizontal={isPortrait && oneColumn}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        {this.state.data.map((item, index)=>this.renderItem(item, index))}
      </ScrollView>
    )
  }

  render() {
    const isPortrait = this.props.windowSize.height > this.props.windowSize.width
    return this.props.animation ? (
      <ToolbarSlideCard
        visible={this.isVisible() && !this.state.isHide}
        contentContainerStyle={!isPortrait && this.props.oneColumn && {width: undefined}}
      >
        {this.renderList()}
      </ToolbarSlideCard>
    ) : (
      <View
        style={[
          isPortrait ? {height: this._getCurrentHeight()} : {width: this._getCurrentHeight()}
        ]}
      >
        {this.renderList()}
      </View>
    )
  }
}

interface ListItemProps {
  isSelected: boolean
  showSelect: boolean
  item: ToolBarListItem
  onSelect(): void
  oneColumn: boolean
  itemCounts: number
  windowSize: ScaledSize
}

interface ListItemState {
  /** 显示下载进度 */
  showProgress: boolean
  /** 监听的下载个数 */
  downloadCount: number
  /** 当前下载任务中进度最快的任务的进度 */
  currentProgress: number
}

class ListItem extends React.Component<ListItemProps, ListItemState> {


  constructor(props: ListItemProps) {
    super(props)

    this.state = {
      showProgress: false,
      downloadCount: 0,
      currentProgress: 0,
    }
  }

  componentDidMount() {
    this.updateProgressState()
  }

  componentDidUpdate(prevProps: ListItemProps) {
    if(JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
      if(prevProps.item.downloadKeys) {
        for(let i = 0; i < prevProps.item.downloadKeys.length; i++) {
          AppProgress.removeProgressListener(prevProps.item.downloadKeys[i])
        }
        this.setState({
          showProgress: false,
          downloadCount: 0,
          currentProgress: 0,
        })
      }
      this.updateProgressState()
    }
  }

  componentWillUnmount() {
    if(this.props.item.downloadKeys) {
      for(let i = 0; i < this.props.item.downloadKeys.length; i++) {
        AppProgress.removeProgressListener(this.props.item.downloadKeys[i])
      }
    }
  }

  /** 更新下载个数和进度 */
  updateProgressState = () => {
    let count = 0
    let hasDownloading = false
    if(this.props.item.downloadKeys) {
      for(let i = 0; i < this.props.item.downloadKeys.length; i++) {
        if(AppProgress.isInProgress(this.props.item.downloadKeys[i])) {
          hasDownloading = true
        }
        if(AppProgress.isProgressEnd(this.props.item.downloadKeys[i])) {
          count++
        }
        AppProgress.addProgressListener(
          this.props.item.downloadKeys[i],
          this.onBegin,
          this.updateProgerss,
          this.onProgressEnd)
      }
      this.setState({
        showProgress: hasDownloading,
        downloadCount: count,
        currentProgress: 0,
      })
    }
  }

  onBegin = () => {
    if(this.props.item.downloadKeys) {
      let count = 0
      for(let i = 0; i < this.props.item.downloadKeys.length; i++) {
        if(AppProgress.isProgressEnd(this.props.item.downloadKeys[i])) {
          count++
        }
      }
      this.setState({
        downloadCount: count,
      })
    }
  }

  updateProgerss = (progress: number) => {
    if(this.state.currentProgress < progress) {
      this.setState({
        showProgress: true,
        currentProgress: progress
      })
    }
  }

  onProgressEnd = () => {
    const totolDownloadCount = this.props.item.downloadKeys?.length
    if(totolDownloadCount && this.state.downloadCount + 1 < totolDownloadCount) {
      this.setState({
        downloadCount: this.state.downloadCount + 1
      })
    }
  }

  render() {
    const isPortrait = this.props.windowSize.height > this.props.windowSize.width
    const item = this.props.item
    const rowCount = this.props.itemCounts < numOfRow ? this.props.itemCounts : numOfRow
    let progress: string
    const totolDownloadCount = item.downloadKeys?.length
    if(totolDownloadCount && totolDownloadCount> 1) {
      progress = this.state.currentProgress + '%' + `(${this.state.downloadCount + 1}/${totolDownloadCount})`
    } else {
      progress = this.state.currentProgress + '%'
    }

    let image: ImageRequireSource | UriType = item.disable && item.disableImage ? item.disableImage : item.image
    if(typeof image === 'string'){
      image = {uri:image}
    }
    return  (
      <View>
        <TouchableOpacity
          onPress={() => {
            !item.disable && this.props.onSelect()
          }}
          style={[{
            height: itemHeight,
            marginVertical: dp(10),
            width: isPortrait ? (this.props.windowSize.width / rowCount) : (LANDSCAPE_WIDTH / 4),
            justifyContent: 'center',
            alignItems: 'center',
          }, !isPortrait && this.props.oneColumn && {
            width: itemHeight,
            height: this.props.windowSize.height / rowCount,
            marginVertical: 0,
            marginHorizontal: dp(10)
          }
          ]}
        >
          <Image
            // source={item.disable && item.disableImage ? item.disableImage : item.image}
            source={image}
            style={AppStyle.Image_Style}
          />
          {(this.state.showProgress || item.text) && (
            <Text style={[
              AppStyle.Text_Style_Small_Center,
              item.disable && {color: AppStyle.Color.Background_Disabled},
              {marginTop: dp(3), marginBottom: dp(5)}
            ]}>
              {this.state.showProgress ? progress : item.text}
            </Text>
          )}
          <View
            style={[{
              width: dp(30),
              height: dp(3),
              borderRadius:dp(3),
              backgroundColor: 'transparent',
            }, this.props.showSelect && this.props.isSelected && {backgroundColor: AppStyle.Color.BLACK}]}
          />
        </TouchableOpacity>
      </View>
    )
  }
}

export default ToolBarList
import * as React from 'react'
import { TouchableOpacity, Text, Image, View, Platform } from 'react-native'
import { getThemeAssets } from '../../assets'
import styles from './styles'
import { FileTools } from '../../native'
import { color } from '../../styles'
import { Progress } from '../../components'

type Data = {
  uri: string,
  path?: string,
  /**
   * video
   * photo
   */
  type: string,
  duration?: number,
}

interface ResParams {
  data: Data,
  index: number,
  ref?: MediaItem,
}

interface Props {
  data: Data,
  index: number,
  showDelete?: boolean,
  onPress?: (data: ResParams) => void,
  onDeletePress?: (data: ResParams) => void,
  onLongPress?: (data: ResParams) => void,
}

interface State {
  imageExist: boolean,
  image: { uri: string },
  showDelete: boolean,
  showProgress: boolean,
}

export default class MediaItem extends React.Component<Props, State> {
  mProgress: Progress | undefined | null
  constructor(props: Props) {
    super(props)
    this.state = {
      imageExist: false,
      image: props.data.uri === '+' ? getThemeAssets().publicAssets.icon_placeholder_s : { uri: props.data.uri },
      showDelete: !!this.props.showDelete,
      showProgress: false,
    }
  }

  componentDidMount() {
    if (this.props.data.uri === '+') return
    this.checkImageExist(this.props.data.uri)
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    if (
      JSON.stringify(nextState) !== JSON.stringify(this.state) ||
      JSON.stringify(nextProps.data) !== JSON.stringify(this.props.data) ||
      nextProps.index !== this.props.index
    ) {
      return true
    }
    return false
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.data.uri === '+') {
      if (prevProps.data.uri !== this.props.data.uri) {
        this.setState({
          image: getThemeAssets().publicAssets.icon_placeholder_s,
        })
      }
      return
    }
    // let newState: any = {}, path = this.props.data.uri
    // if (prevProps.data.uri !== path) {
    //   newState.image = { uri: path }
    // }
    // FileTools.fileIsExist(path).then(result => {
    //   if (this.state.imageExist !== result) {
    //     newState.imageExist = result
    //   }
    //   if (Object.keys(newState).length > 0) {
    //     this.setState(newState)
    //   }
    // })
    this.checkImageExist(this.props.data.uri)
  }

  checkImageExist = (path: string) => {
    if (!path || path === '+') return
    if (path.indexOf('content://') === 0 || path.indexOf('assets-library://') === 0) {
      // 相册中获取的图片
      if (!this.state.imageExist || this.state.image.uri !== path) {
        this.setState({
          imageExist: true,
          image: { uri: path },
        })
      }
    } else {
      let _path = path
      if (path.indexOf('file://') === 0) {
        _path = _path.replace('file://', '')
      }
      // 文件目录中获取的图片
      FileTools.fileIsExist(_path).then(result => {
        if (this.state.imageExist !== result || this.state.image.uri !== path) {
          this.setState({
            imageExist: result,
            image: { uri: path },
          })
        }
      })
    }
  }

  _onPress = () => {
    if (this.props.onPress && typeof this.props.onPress === 'function') {
      this.props.onPress({
        data: this.props.data,
        index: this.props.index,
      })
    }
  }

  _deletePress = () => {
    if (
      this.props.onDeletePress &&
      typeof this.props.onDeletePress === 'function'
    ) {
      this.props.onDeletePress({
        data: this.props.data,
        index: this.props.index,
      })
    }
  }

  _onLongPress = () => {
    if (
      this.props.onLongPress &&
      typeof this.props.onLongPress === 'function'
    ) {
      this.props.onLongPress({
        ref: this,
        data: this.props.data,
        index: this.props.index,
      })
    }
  }

  setDelete = (showDelete: boolean) => {
    if (showDelete !== this.state.showDelete) {
      this.setState({
        showDelete,
      })
    }
  }

  renderDuration = (sec: number) => {
    let m = 0
    if (sec >= 60) {
      m = Math.floor(sec / 60)
      sec -= 60 * m
    }
    let s = Number(sec.toFixed())
    let duration = (m >= 10 ? '' : '0') + m + ':' + (s >= 10 ? '' : '0') + s
    return <Text style={styles.duration}>{duration}</Text>
  }

  renderDelete = () => {
    if (!this.state.showDelete || this.props.data.uri === '+') return null
    return (
      // <View style={styles.deleteOverlay}>
      <TouchableOpacity style={styles.deleteView} onPress={this._deletePress}>
        <Image
          resizeMode={'contain'}
          style={styles.deleteImg}
          source={getThemeAssets().publicAssets.icon_img_close}
        />
      </TouchableOpacity>
      // </View>
    )
  }

  undateProgress = (progress: number) => {
    if (this.mProgress) {
      this.mProgress.progress = progress
    }
    if (!this.state.showProgress && progress >= 0) {
      this.setState({
        showProgress: true,
      })
    } else if (this.state.showProgress && progress === 1) {
      let timer = setTimeout(() => {
        this.setState({
          showProgress: false,
        })
        clearTimeout(timer)
      }, 1000)
    }
  }

  renderProgress = () => {
    if (!this.state.showProgress) return null
    return (
      <Progress
        ref={ref => (this.mProgress = ref)}
        style={styles.progressView}
        progressAniDuration={0}
        progressColor={color.selected}
      />
    )
  }

  render = () => {
    let image
    if (this.props.data.uri === '+') {
      image = getThemeAssets().publicAssets.img_add_upload
    } else {
      let imgPath = this.props.data.path || this.props.data.uri || ''
      if (
        Platform.OS === 'android' &&
        imgPath.toLowerCase().indexOf('content://') !== 0 &&
        imgPath.toLowerCase().indexOf('file://') !== 0
      ) {
        imgPath = 'file://' + imgPath
      }

      image = this.state.imageExist ? { uri: imgPath } : getThemeAssets().publicAssets.icon_placeholder_s
    }

    return (
      <View style={styles.imageView}>
        <TouchableOpacity
          key={this.props.index}
          style={styles.imageView}
          onPress={this._onPress}
          onLongPress={this._onLongPress}
          delayPressIn={1000}
        >
          <Image style={styles.image} resizeMode={'cover'} source={image} />
          {this.props.data.uri !== '+' && this.props.data.duration !== undefined && this.props.data.duration >= 0 &&
            this.props.data.type === 'video' &&
            this.renderDuration(this.props.data.duration)}
        </TouchableOpacity>
        {this.renderProgress()}
        {this.renderDelete()}
      </View>
    )
  }
}

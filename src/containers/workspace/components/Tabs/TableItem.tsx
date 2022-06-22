import * as React from 'react'
import { StyleSheet, TouchableOpacity, View, Text, Image } from 'react-native'
import { color } from '../../../../styles'
import { scaleSize, setSpText, AppProgress } from '../../../../utils'
import { TableItemType } from './types'

interface Props {
  data: TableItemType,
  isSelected?: boolean,
  rowIndex: number,
  cellIndex: number,
  getData?: () => void,
}

interface State {
  /** 显示下载进度 */
  showProgress: boolean,
  /** 监听的下载个数 */
  downloadCount: number,
  /** 当前下载任务中进度最快的任务的进度 */
  currentProgress: number,
}

export default class TableItem extends React.Component<Props, State> {
  static defaultProps = {
    isSelected: false,
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      showProgress: false,
      downloadCount: 0,
      currentProgress: 0,
    }
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return (
      JSON.stringify(this.props) !== JSON.stringify(nextProps) ||
      JSON.stringify(this.state) !== JSON.stringify(nextState)
    )
  }

  componentDidMount() {
    this.updateProgressState()
  }

  componentDidUpdate(prevProps: Props) {
    if(JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
      this.updateProgressState()
    }
  }

  componentWillUnmount() {
    if(this.props.data.downloadKeys) {
      for(let i = 0; i < this.props.data.downloadKeys.length; i++) {
        AppProgress.removeProgressListener(this.props.data.downloadKeys[i])
      }
    }
  }

  /** 更新下载个数和进度 */
  updateProgressState = () => {
    let count = 0
    let hasDownloading = false
    if(this.props.data.downloadKeys) {
      for(let key of this.props.data.downloadKeys) {
        if(AppProgress.isInProgress(key)) {
          hasDownloading = true
        }
        if(AppProgress.isProgressEnd(key)) {
          count++
        } else {
          AppProgress.addProgressListener(
            key,
            () => {},
            this.updateProgerss,
            () => {
              this.onProgressEnd(key)
            },
          )
        }
      }
      this.setState({
        showProgress: hasDownloading,
        downloadCount: count,
        currentProgress: 0,
      })
    } else if (this.state.showProgress) {
      // 下载完毕后，只有一个数据，原来showProgress为true，不能更新title
      // 需要重新setState showProgress的值
      this.setState({
        showProgress: false,
        downloadCount: count,
        currentProgress: 0,
      })
    }
  }

  updateProgerss = (progress: number) => {
    if(this.state.currentProgress < progress) {
      this.setState({
        showProgress: true,
        currentProgress: progress,
      })
    }
  }

  onProgressEnd = (key: string | undefined) => {
    const totolDownloadCount = this.props.data.downloadKeys?.length
    if(totolDownloadCount && this.state.downloadCount + 1 < totolDownloadCount) {
      this.setState({
        downloadCount: this.state.downloadCount + 1,
      }, () => {
        this.props.getData && this.props.getData()
        if(key) {
          // 下载完成后，删除监听和下载进程
          AppProgress.removeProgressListener(key)
          AppProgress.removeProgress(key)
        }
      })
    } else {
      this.props.getData && this.props.getData()
      if(key) {
        // 下载完成后，删除监听和下载进程
        AppProgress.removeProgressListener(key)
        AppProgress.removeProgress(key)
      }
    }
  }

  _action = () => {
    if (this.props.data?.action) {
      this.props.data.action(this.props.data)
    }
  }

  render() {
    let icon, isSelected = this.props.isSelected && this.props.data.selectedImage
    if (isSelected) {
      icon = this.props.data.selectedImage
    } else {
      icon = this.props.data.image
    }
    const item = this.props.data
    let progress: string
    const totolDownloadCount = item.downloadKeys?.length
    if(totolDownloadCount && totolDownloadCount> 1) {
      progress = this.state.currentProgress + '%' + `(${this.state.downloadCount + 1}/${totolDownloadCount})`
    } else {
      progress = this.state.currentProgress + '%'
    }
    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity
          onPress={this._action}
          style={[styles.imageView, isSelected && styles.selectImageBg]}
        >
          <Image
            resizeMode={'contain'}
            source={icon}
            style={styles.smallIcon}
          />
        </TouchableOpacity>

        <Text style={styles.title}>
          {this.state.showProgress ? progress : this.props.data.title}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  itemContainer: {
    width: scaleSize(100),
    height: scaleSize(110),
    alignItems: 'center',
    // justifyContent: 'center',
    justifyContent: 'space-around',
  },
  imageView: {
    width: scaleSize(50),
    height: scaleSize(50),
    justifyContent: 'center',
    alignItems: 'center',
    // borderRadius: scaleSize(40),
    // backgroundColor: color.itemColorGray4,
  },
  selectImageBg: {
    backgroundColor: color.itemColorGray,
  },
  smallIcon: {
    width: scaleSize(50),
    height: scaleSize(50),
  },
  title: {
    marginTop: scaleSize(10),
    color: color.font_color_white,
    fontSize: setSpText(15),
    backgroundColor: 'transparent',
    textAlign: 'center',
    paddingVertical: 0,
  },
})

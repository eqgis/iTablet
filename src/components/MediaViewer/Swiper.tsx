import React, { ReactElement, ReactNode } from 'react'
import {
  StyleSheet,
  ScrollView,
  ScrollViewProps,
  View,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native'
import { screen } from '@/utils'

interface Props extends ScrollViewProps {
  children?: ReactNode[] | undefined,
  index: number,
  dot?: ReactElement,
  activeDot?: ReactElement,
  orientation: string,
  onScrollBegin?: (e: NativeSyntheticEvent<NativeScrollEvent>, state: State) => void,
}

interface State {
  index: number,
  width: number,
  height: number,
}

export default class Swiper extends React.Component<Props, State> {

  scrollView: ScrollView | null | undefined

  constructor(props: Props) {
    super(props)
    this.state = {
      index: this.props.index,
      width: screen.getScreenSafeWidth(props.orientation),
      height: screen.getScreenSafeHeight(props.orientation),
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.scrollView?.scrollTo({ x: this.state.width * this.state.index, y: 0, animated: false })
    }, 0)
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.index !== prevProps.index) {
      this.setState({
        index: this.props.index
      }, () => {
        this.scrollView?.scrollTo({ x: this.state.width * this.state.index, y: 0, animated: false })
      })
    } else if (prevProps.orientation !== this.props.orientation) {
      this.setState({
        width: screen.getScreenSafeWidth(this.props.orientation),
        height: screen.getScreenSafeHeight(this.props.orientation),
      }, () => {
        setTimeout(() => {
          this.scrollView?.scrollTo({ x: this.state.width * this.state.index, y: 0, animated: false })
        }, 0)
      })
    }
  }

  renderPagination = () => {
    // By default, dots only show when `total` >= 2
    if (!this.props.children || this.props.children?.length <= 1) return null

    const dots = []
    const ActiveDot = this.props.activeDot || (
      <View
        style={[
          {
            backgroundColor: '#007aff',
            width: 8,
            height: 8,
            borderRadius: 4,
            marginLeft: 3,
            marginRight: 3,
            marginTop: 3,
            marginBottom: 3
          },
        ]}
      />
    )
    const Dot = this.props.dot || (
      <View
        style={[
          {
            backgroundColor: 'rgba(0,0,0,.2)',
            width: 8,
            height: 8,
            borderRadius: 4,
            marginLeft: 3,
            marginRight: 3,
            marginTop: 3,
            marginBottom: 3
          },
        ]}
      />
    )
    for (let i = 0; i < this.props.children?.length; i++) {
      dots.push(
        i === this.state.index
          ? React.cloneElement(ActiveDot, { key: i })
          : React.cloneElement(Dot, { key: i })
      )
    }

    return (
      <View
        pointerEvents="none"
        style={[
          styles.pagination_x,
        ]}
      >
        {dots}
      </View>
    )
  }

  onScrollBegin = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    this.props.onScrollBegin &&
      this.props.onScrollBegin(event, this.state)
  }

  // onScrollEndDrag = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
  //   // console.warn('onScrollEndDrag', event.nativeEvent)
  // }

  onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width)
    this.setState({
      index: index,
    })
  }

  render(): ReactNode {
    const page: ReactNode[] = []
    if (this.props.children && this.props.children?.length > 0) {
      this.props.children?.map((children, i) => {
        page.push(
          <View style={{width: this.state.width, height: this.state.height, justifyContent: 'center', alignItems: 'center'}} key={i}>
            {children}
          </View>
        )
      })
    }
    return (
      <View style={{flex: 1, backgroundColor: 'black'}}>
        <ScrollView
          ref={ref => this.scrollView = ref}
          pagingEnabled
          horizontal
          showsHorizontalScrollIndicator={false}
          {...this.props}
          onScrollBeginDrag={this.onScrollBegin}
          onMomentumScrollEnd={this.onScrollEnd}
        >
          {page}
        </ScrollView>
        {this.renderPagination()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  pagination_x: {
    position: 'absolute',
    bottom: 25,
    left: 0,
    right: 0,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
})
import * as React from 'react'
import { StyleSheet } from 'react-native'
import { color } from '../../../../styles'
import { scaleSize, setSpText, screen } from '../../../../utils'
import { Height, ToolbarType } from '../../../../constants'
import { TableList } from '../../../../components'
import DefaultTabBar from './DefaultTabBar'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import TableItem from './TableItem'
import { TableItemType } from './types'
import { ToolbarTableList } from '../ToolBar/components'
import { ToolBarSlide } from '../ToolBar/components'

interface Props {
  data: any[],
  device: any,
  column?: number,
  style?: {[name: string]: any},
}

interface State {
  currentPage: number,
}

export default class Tabs extends React.Component<Props, State> {

  static defaultProps = {
    column: 5,
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      currentPage: 0,
    }
  }

  componentDidMount() {
    
  }

  componentDidUpdate(prevProps: Props) {
    if (
      JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data)
    ) {
      this.goToPage(0)
    }
  }

  goToPage = (index: number) => {
    this.state.currentPage !== index &&
      this.setState({
        currentPage: index,
      })
  }

  _getWidth = () => {
    let width = screen.getScreenWidth(this.props.device.orientation)
    if (this.props.device.orientation.indexOf('LANDSCAPE') === 0) {
      width = Height.TABLE_ROW_HEIGHT_2 * 8
    }
    return width
  }

  _renderItem = (data: { item: TableItemType, rowIndex: number, cellIndex: number }) => {
    return(
      <TableItem
        data={data.item}
        rowIndex={data.rowIndex}
        cellIndex={data.cellIndex}
      />
    )
  }

  _renderTab = (tabLabel: string, data: any, type?: string) => {
    let tab
    if (data.customView) {
      tab = data.customView
    } else if (type) {
      switch(type) {
        case ToolbarType.slider:
          tab = <ToolBarSlide data={data}/>
          break
      }
    }
    if (!tab) {
      tab = (
        <TableList
          style={styles.table}
          data={data}
          type={ToolbarType.scrollTable}
          column={data.length < 5 ? data.length : this.props.column}
          renderCell={this._renderItem}
          device={this.props.device}
          isAutoType={false}
          cellStyle={styles.cellStyle}
          horizontal={true}
          // rowStyle={{height: scaleSize(200)}}
        />
      )
    }
    return React.cloneElement(tab, {tabLabel: tabLabel})
  }

  _renderTabs = () => {
    const data: any[] = []
    this.props.data.forEach(item => {
      data.push(this._renderTab(item.title, item.data, item.type))
    })
    return data
  }

  render() {
    if (!this.props.data || this.props.data.length === 0) {
      return null
    }
    return (
      <ScrollableTabView
        // ref={ref => (this.scrollTab = ref)}
        style={[styles.container, this.props.style]}
        initialPage={0}
        page={this.state.currentPage}
        onChangeTab={(data: {
          i: number,
          ref: typeof TableList,
          from: number,
        }) => this.goToPage(data.i)}
        locked={true}
        renderTabBar={(props: {[name: string]: any}) => (
          <DefaultTabBar
            {...props}
            activeBackgroundColor={'transparent'}
            activeTextColor={color.themeText2}
            inactiveTextColor={color.white}
            textStyle={styles.tabTextStyle}
            tabStyle={styles.tabStyle}
          />
        )}
        tabBarUnderlineStyle={[
          styles.tabBarUnderlineStyle,
          {marginLeft: this._getWidth() / this.props.data.length / 2 - scaleSize(32)},
        ]}
      >
        {this._renderTabs()}
      </ScrollableTabView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 0,
    backgroundColor: color.white,
    overflow: 'hidden',
    borderTopLeftRadius: scaleSize(40),
    borderTopRightRadius: scaleSize(40),
    shadowOffset: { width: 0, height: 0 },
    shadowColor: color.itemColorGray3,
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 20,
  },
  tabBarUnderlineStyle: {
    backgroundColor: color.black,
    height: scaleSize(4),
    width: scaleSize(64),
    borderRadius: scaleSize(2),
    marginBottom: scaleSize(12),
  },
  tabTextStyle: {
    fontSize: setSpText(22),
    backgroundColor: 'transparent',
    color: color.fontColorBlack,
  },
  tabStyle: {
    // backgroundColor: color.subTheme,
    marginTop: scaleSize(20),
    backgroundColor: color.white,
    height: scaleSize(40),
  },
  table: {
    flex: 1,
  },
  cellStyle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})

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

interface Props {
  data: any[],
  device: any,
  column?: number,
  style?: {[name: string]: any},
}

export default class Tabs extends React.Component<Props> {

  static defaultProps = {
    column: 5,
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      currentPage: 1,
    }
  }

  componentDidMount() {
    
  }

  // componentDidUpdate(prevProps) {
  //   if (
  //     JSON.stringify(prevProps.map.currentMap) !==
  //       JSON.stringify(this.props.map.currentMap) &&
  //     this.props.map.currentMap.name
  //   ) {
  //     if (this.props.map.currentMap && this.props.map.currentMap.Template) {
  //       this.initTemplate()
  //     } else {
  //       this.initSymbols()
  //     }
  //   }
  // }

  goToPage = (index: number) => {
    // this.scrollTab.goToPage(index)
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

  _renderTab = (tabLabel: string, data: any) => {
    return (
      React.cloneElement(
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
        , {tabLabel: tabLabel})
    )
  }

  _renderTabs = () => {
    const data: any[] = []
    this.props.data.forEach(item => {
      data.push(this._renderTab(item.title, item.data))
    })
    return data
  }

  render() {
    return (
      <ScrollableTabView
        // ref={ref => (this.scrollTab = ref)}
        style={[styles.container, this.props.style]}
        initialPage={0}
        // page={this.state.currentPage}
        // onChangeTab={(data: {
        //   i: number,
        //   ref: typeof TableList,
        //   from: number,
        // }) => this.goToPage(data.i)}
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

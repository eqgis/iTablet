import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import { color } from '../../../../styles'
import { scaleSize, setSpText, screen } from '../../../../utils'
import { Height, ToolbarType } from '../../../../constants'
import { DEVICE } from '../../../../redux/models/device'
import { TableList } from '../../../../components'
import DefaultTabBar from './DefaultTabBar'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import TableItem from './TableItem'
import { TableItemType } from './types'
import { ToolbarTableList } from '../ToolBar/components'
import { ToolBarSlide } from '../ToolBar/components'

interface Props {
  data: any[],
  device: DEVICE,
  column?: number,
  style?: {[name: string]: any},
}

interface State {
  currentPage: number,
}

interface TableData {
  title: string,
  data: any,
  type?: string,
  getData?: () => Promise<any>,
}


export default class Tabs extends React.Component<Props, State> {

  static defaultProps = {
    column: 5,
    data: [],
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
      if (this.props.data.length > 0) {
        this.goToPage(0)
      }
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

  // _renderItem = (data: { item: TableItemType, rowIndex: number, cellIndex: number }) => {
  //   return(
  //     <TableItem
  //       data={data.item}
  //       rowIndex={data.rowIndex}
  //       cellIndex={data.cellIndex}
  //     />
  //   )
  // }

  _renderTab = (item: TableData) => {
    let tab, data = item.data
    if (data) {
      if (data.customView) {
        tab = data.customView
      } else if (item.type) {
        switch(item.type) {
          case ToolbarType.slider:
            tab = <ToolBarSlide data={data}/>
            break
        }
      }
    }
    if (!tab) {
      tab = (
        <Table
          data={item.data}
          getData={item.getData}
          column={data?.length < 5 ? data?.length : this.props.column}
          device={this.props.device}
        />
      )
      // tab = (
      //   <TableList
      //     style={styles.table}
      //     data={data}
      //     type={ToolbarType.scrollTable}
      //     column={data.length < 5 ? data.length : this.props.column}
      //     renderCell={this._renderItem}
      //     device={this.props.device}
      //     isAutoType={false}
      //     cellStyle={styles.cellStyle}
      //     horizontal={true}
      //     // rowStyle={{height: scaleSize(200)}}
      //   />
      // )
    }
    return React.cloneElement(tab, {tabLabel: item.title})
  }

  _renderTabs = () => {
    const data: any[] = []
    this.props.data.forEach(item => {
      data.push(this._renderTab(item))
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

interface TableItemData {
  item: TableItemType,
  rowIndex: number,
  cellIndex: number,
}

interface TableProps {
  data: TableItemData[],
  device: DEVICE,
  column: number,
  getData?: () => Promise<any>,
}
interface TableState {
  data: TableItemData[],
}
class Table extends React.Component<TableProps, TableState> {
  static defaultProps = {
    data: [],
    column: 5,
  }

  constructor(props: TableProps) {
    super(props)
    this.state = {
      data: props.data,
    }
  }

  shouldComponentUpdate(nextProps: TableProps, nextState: TableState) {
    if (
      JSON.stringify(nextProps) !== JSON.stringify(this.props) ||
      JSON.stringify(nextState) !== JSON.stringify(this.state)
    ) {
      return true
    }
    return false
  }

  componentDidMount() {
    this.getData()
  }

  async componentDidUpdate(prevProps: TableProps, prevState: TableState) {
    if (
      JSON.stringify(prevProps) !== JSON.stringify(this.props) ||
      JSON.stringify(prevState) !== JSON.stringify(this.state)
    ) {
      if (this.props.getData) {
        this.getData()
      } else if (JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data)) {
        this.setState({
          data: this.props.data,
        })
      }
    }
  }

  getData = async () => {
    if (this.props.getData) {
      const data = await this.props.getData()
      this.setState({
        data: data,
      })
    }
  }

  _renderItem = (data: { item: TableItemType, rowIndex: number, cellIndex: number }) => {
    return(
      <View style={{flex: 1}}>
        <TableItem
          data={data.item}
          rowIndex={data.rowIndex}
          cellIndex={data.cellIndex}
          getData={this.getData}
        />
      </View>
    )
  }

  render() {
    return (
      <TableList
        style={styles.table}
        data={this.state.data}
        type={ToolbarType.scrollTable}
        column={this.state.data.length < 5 ? this.state.data.length : this.props.column}
        renderCell={this._renderItem}
        device={this.props.device}
        isAutoType={false}
        cellStyle={styles.cellStyle}
        horizontal={true}
        // rowStyle={{height: scaleSize(200)}}
      />
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
    textAlign: 'center',
  },
  tabStyle: {
    // backgroundColor: color.subTheme,
    // marginTop: scaleSize(20),
    backgroundColor: color.white,
    // height: scaleSize(40),
  },
  table: {
    flex: 1,
  },
  cellStyle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})

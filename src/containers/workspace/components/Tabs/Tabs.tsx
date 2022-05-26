import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import { color } from '../../../../styles'
import { scaleSize, setSpText, screen } from '../../../../utils'
import { Height, ToolbarType } from '../../../../constants'
import { DEVICE } from '../../../../redux/models/device'
import { TableList } from '../../../../components'
import TableItem from './TableItem'
import { TableItemType } from './types'
import { ToolBarSlide } from '../ToolBar/components'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'

interface Props {
  data: any[],
  device: DEVICE,
  column?: number,
  initialIndex?: number,
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
  opPress?: () => void,
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
    this.props.data[index]?.onPress?.()
  }

  _getWidth = () => {
    let width = screen.getScreenWidth(this.props.device.orientation)
    if (this.props.device.orientation.indexOf('LANDSCAPE') === 0) {
      width = Height.TABLE_ROW_HEIGHT_2 * 8
    }
    return width
  }

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
    }
    return React.cloneElement(tab, {tabLabel: item.title})
  }

  _getRoutes = () => {
    const routes: {key: string, title: string}[] = []
    this.props.data.forEach(item => {
      routes.push({
        key: item.title,
        title: item.title,
      })
    })
    return routes
  }

  _renderTabs = () => {
    const data: any = {}
    this.props.data.forEach(item => {
      data[item.title] = () => this._renderTab(item)
    })
    return SceneMap(data)
  }

  renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={[
        styles.tabBarUnderlineStyle,
        // {marginLeft: this._getWidth() / this.props.data.length / 2 - scaleSize(16)},
        {marginLeft: scaleSize(43)},
      ]}
      // onTabPress={({route, preventDefault}) => {
      //   const routes = this._getRoutes()
      //   for (const index in routes) {
      //     if (Object.hasOwnProperty.call(routes, index)) {
      //       const element = routes[index];
      //       if (element.key === route.key) {
      //         this.setState({
      //           currentPage: parseInt(index),
      //         })
      //         preventDefault()
      //         break
      //       }
      //     }
      //   }
      // }}
      style={styles.tabStyle}
      labelStyle={styles.tabTextStyle}
      activeColor={color.themeText2}
      scrollEnabled={true}
      tabStyle={{width:scaleSize(150)}}
    />
  )

  render() {
    if (!this.props.data || this.props.data.length === 0) {
      return null
    }
    return (
      <TabView
        navigationState={{
          index: this.props.initialIndex || 0,
          routes: this._getRoutes(),
        }}
        onIndexChange={this.goToPage}
        renderTabBar={this.renderTabBar}
        renderScene={this._renderTabs()}
        swipeEnabled={false}
      />
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
    backgroundColor: color.white,
    elevation: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
  },
  table: {
    flex: 1,
  },
  cellStyle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})

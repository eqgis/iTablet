import React from 'react'
import {
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ListRenderItemInfo,
} from 'react-native'
import { getPublicAssets, getThemeAssets } from '@/assets'
import { getLanguage } from '@/language'
import styles from './styles'
import { screen } from '@/utils'
import { DropdownView } from '@/components'

const orderBy = {
  lastModifiedTime: 'LASTMODIFIEDTIME',
  fileName: 'fileName',
}

const orderType = {
  ASC: 'ASC',
  DESC: 'DESC',
}

export interface SearchParamsType {
  keywords?: string
  selectTypes?: string[],
  orderBy?: string,
  orderType?: string,
}

interface DataItemType {
  key: string,
  value: string | string[],
}

interface Props {
  setParams: (data: SearchParamsType) => void,
  showFilter: boolean,
}

interface State {
  data: DataItemType[],
  selectList: string[],
  orderBy: string,
  orderType: string,
  searchText: string,
}

export default class SearchMenu extends React.Component<Props, State> {

  dropdownView: DropdownView | undefined | null
  searchBar: TextInput | undefined | null

  static defaultProps = {
    showFilter: true,
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      data: this.getData(),
      selectList: this.getAllDataTypes(),
      orderBy: orderBy.lastModifiedTime,
      orderType: orderType.DESC,
      searchText: '',
    }
  }

  getData = () => [
    {
      key: getLanguage(global.language).Find.ALL,
      value: 'all',
    },
    {
      key: getLanguage(global.language).Find.ONLINE_WORKSPACE,
      value: ['WORKSPACE'],
    },
    {
      key: getLanguage(global.language).Find.ONLINE_DATASOURCE,
      value: ['UDB'],
    },
    {
      key: getLanguage(global.language).Find.ONLINE_SYMBOL,
      value: ['MARKERSYMBOL', 'LINESYMBOL', 'FILLSYMBOL'],
    },
    {
      key: getLanguage(global.language).Find.ONLINE_COLORSCHEME,
      value: ['COLORSCHEME'],
    },
  ]

  getAllDataTypes = () => {
    const allData = this.getData()
    const allDataList = []
    for (let i = 1; i < allData.length; i++) {
      allDataList.push(allData[i].key)
    }
    return allDataList
  }

  getValueByKey = (key: string) => {
    const data = this.getData()
    for (let i = 0; i < data.length; i++) {
      if (data[i].key === key) {
        return data[i].value
      }
    }
  }

  setVisible = (visible: boolean) => {
    this.dropdownView?.setVisible(visible)
  }

  reset = () => {
    if (this.state.searchText !== '') {
      this.setSearchText('')
      this.searchBar && this.searchBar.clear()
    }
  }

  search = () => {
    this.setVisible(false)
  }

  setParams = () => {
    let selectTypes: string[] = []
    for (let i = 0; i < this.state.selectList.length; i++) {
      const temp = this.getValueByKey(this.state.selectList[i])
      if (temp instanceof Array) {
        selectTypes = selectTypes.concat(temp)
      } else if (temp) {
        selectTypes.push(temp)
      }
    }
    this.props.setParams({
      keywords:
        this.state.searchText === '' ? undefined : this.state.searchText,
      selectTypes: selectTypes,
      orderBy: this.state.orderBy,
      orderType: this.state.orderType,
    })
  }

  setSearchText = (text: string) => {
    this.setState({ searchText: text })
    this.props.setParams({
      keywords: text,
    })
  }

  setTypes = (selectList: string[]) => {
    let selectTypes: string[] = []
    for (let i = 0; i < selectList.length; i++) {
      const temp = this.getValueByKey(this.state.selectList[i])
      if (temp instanceof Array) {
        selectTypes = selectTypes.concat(temp)
      } else if (temp) {
        selectTypes.push(temp)
      }
    }
    this.props.setParams({
      selectTypes: selectTypes,
    })
  }

  setOrder = (value: string) => {
    const order = this._getOrder(value)
    this.setState({
      orderBy: order._orderBy,
      orderType: order._orderType,
    })
    this.props.setParams({
      orderBy: order._orderBy,
      orderType: order._orderType,
    })
  }

  _getOrder = (orderBy: string) => {
    const _orderBy = orderBy
    let _orderType
    if (this.state.orderBy === orderBy) {
      if (this.state.orderType === orderType.ASC) {
        _orderType = orderType.DESC
      } else {
        _orderType = orderType.ASC
      }
    } else {
      _orderType = orderType.DESC
    }
    return { _orderBy, _orderType }
  }

  renderOrderBar = () => {
    const indicator = this.state.orderType === orderType.ASC ? '↑' : '↓'
    return (
      <View style={styles.orderView}>
        <TouchableOpacity
          style={styles.orderItem}
          onPress={() => {
            this.setOrder(orderBy.fileName)
          }}
        >
          <Image
            source={getThemeAssets().find.sort_name}
            style={styles.orderImg}
          />
          <Text style={styles.textStyle}>
            {getLanguage(global.language).Find.SORT_BY_NAME}
          </Text>
          <Text style={styles.orderText}>
            {this.state.orderBy === orderBy.fileName ? indicator : ''}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.orderItem}
          onPress={() => {
            this.setOrder(orderBy.lastModifiedTime)
          }}
        >
          <Image
            source={getThemeAssets().find.sort_time}
            style={styles.orderImg}
          />
          <Text style={styles.textStyle}>
            {getLanguage(global.language).Find.SORT_BY_TIME}
          </Text>
          <Text style={styles.orderText}>
            {this.state.orderBy === orderBy.lastModifiedTime ? indicator : ''}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderItemAllSelect = (item: DataItemType) => {
    const allData = this.getData()
    const isAllSelected = this.state.selectList.length === allData.length - 1
    const img = isAllSelected
      ? getPublicAssets().common.icon_check
      : getPublicAssets().common.icon_uncheck
    return (
      <View style={styles.MenuItemContainerStyle}>
        <TouchableOpacity
          style={styles.ListItemViewStyle}
          onPress={() => {
            const selectList = []
            if (!isAllSelected) {
              for (let i = 1; i < allData.length; i++) {
                selectList.push(allData[i].key)
              }
            }
            this.setState({ selectList })
            this.setTypes(selectList)
          }}
        >
          <Image source={img} style={styles.MenuImageStyle} />
          <Text style={styles.textStyle}>{item.key}</Text>
        </TouchableOpacity>
        <View style={styles.menuSeperator} />
      </View>
    )
  }

  // renderItem = ({ index, item }) => {
  renderItem = (params: ListRenderItemInfo<DataItemType>) => {
    if (params.item.value === 'all') {
      return this.renderItemAllSelect(params.item)
    }
    const indexInList = this.state.selectList.indexOf(params.item.key)
    const img =
      indexInList !== -1
        ? getPublicAssets().common.icon_check
        : getPublicAssets().common.icon_uncheck
    return (
      <View style={styles.MenuItemContainerStyle}>
        <TouchableOpacity
          style={styles.ListItemViewStyle}
          onPress={() => {
            const selectList = this.state.selectList.clone()
            if (indexInList === -1) {
              selectList.push(params.item.key)
            } else {
              selectList.splice(indexInList, 1)
            }
            this.setState({ selectList: selectList })
            this.setTypes(selectList)
          }}
        >
          <Image source={img} style={styles.MenuImageStyle} />
          <Text style={styles.textStyle}>{params.item.key}</Text>
        </TouchableOpacity>
        {this.state.data.length !== params.index + 1 && (
          <View style={styles.menuSeperator} />
        )}
      </View>
    )
  }

  renderSearchBar = () => {
    return (
      <View style={styles.searchViewStyle}>
        <View style={styles.searchBarStyle}>
          <Image
            style={styles.searchImgStyle}
            source={getPublicAssets().common.icon_search_a0}
          />
          <TextInput
            ref={ref => (this.searchBar = ref)}
            style={styles.searchInputStyle}
            placeholder={getLanguage(global.language).Profile.SEARCH}
            defaultValue={this.state.searchText}
            placeholderTextColor={'#A7A7A7'}
            returnKeyType={'search'}
            onSubmitEditing={this.search}
            onChangeText={value => {
              this.setSearchText(value)
            }}
          />
        </View>
      </View>
    )
  }

  renderButtons = () => {
    return (
      <View style={styles.searchButtonContainer}>
        <TouchableOpacity style={styles.searchButton} onPress={this.reset}>
          <Text style={styles.searchButtonText}>
            {getLanguage(global.language).Find.RESET}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.searchButton} onPress={this.search}>
          <Text style={styles.searchButtonText}>
            {getLanguage(global.language).SEARCH}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderList = () => {
    const orientation = screen.getOrientation()
    return (
      <View
        style={[
          styles.SearchMenuContainer,
          orientation.indexOf('LANDSCAPE') === 0
            ? {
              width: '50%',
              height: '100%',
            }
            : {
              width: '100%',
              maxHeight: '65%',
            },
        ]}
      >
        {this.renderSearchBar()}
        {this.renderOrderBar()}
        {
          this.props.showFilter &&
          <FlatList
            data={this.state.data}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
            extraData={this.state.selectList}
          />
        }
        {this.renderButtons()}
      </View>
    )
  }

  render() {
    return (
      <DropdownView
        ref={ref => (this.dropdownView = ref)}
        onBackgroudPress={() => {
          this.setVisible(false)
        }}
      >
        {this.renderList()}
      </DropdownView>
    )
  }
}

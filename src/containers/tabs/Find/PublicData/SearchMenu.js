import React from 'react'
import {
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native'
import { getPublicAssets, getThemeAssets } from '../../../../assets'
import { getLanguage } from '../../../../language'
import styles from './styles'
import { screen } from '../../../../utils'
import { DropdownView } from '../../../../components'

const orderBy = {
  lastModifiedTime: 'LASTMODIFIEDTIME',
  fileName: 'fileName',
}

const orderType = {
  ASC: 'ASC',
  DESC: 'DESC',
}

export default class SearchMenu extends React.Component {
  props: {
    setParams: () => {},
  }

  constructor(props) {
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
    let allData = this.getData()
    let allDataList = []
    for (let i = 1; i < allData.length; i++) {
      allDataList.push(allData[i].key)
    }
    return allDataList
  }

  getValueByKey = key => {
    let data = this.getData()
    for (let i = 0; i < data.length; i++) {
      if (data[i].key === key) {
        return data[i].value
      }
    }
  }

  setVisible = visible => {
    this.dropdownView.setVisible(visible)
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
    let selectTypes = []
    for (let i = 0; i < this.state.selectList.length; i++) {
      selectTypes = selectTypes.concat(
        this.getValueByKey(this.state.selectList[i]),
      )
    }
    this.props.setParams({
      keywords:
        this.state.searchText === '' ? undefined : this.state.searchText,
      selectTypes: selectTypes,
      orderBy: this.state.orderBy,
      orderType: this.state.orderType,
    })
  }

  setSearchText = text => {
    this.setState({ searchText: text })
    this.props.setParams({
      keywords: text === '' ? undefined : text,
    })
  }

  setTypes = selectList => {
    let selectTypes = []
    for (let i = 0; i < selectList.length; i++) {
      selectTypes = selectTypes.concat(this.getValueByKey(selectList[i]))
    }
    this.props.setParams({
      selectTypes: selectTypes,
    })
  }

  setOrder = value => {
    let order = this._getOrder(value)
    this.setState({
      orderBy: order._orderBy,
      orderType: order._orderType,
    })
    this.props.setParams({
      orderBy: order._orderBy,
      orderType: order._orderType,
    })
  }

  _getOrder = orderBy => {
    let _orderBy, _orderType
    _orderBy = orderBy
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
    let indicator = this.state.orderType === orderType.ASC ? '↑' : '↓'
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

  renderItemAllSelect = item => {
    let allData = this.getData()
    let isAllSelected = this.state.selectList.length === allData.length - 1
    let img = isAllSelected
      ? getPublicAssets().common.icon_check
      : getPublicAssets().common.icon_uncheck
    return (
      <View style={styles.MenuItemContainerStyle}>
        <TouchableOpacity
          style={styles.ListItemViewStyle}
          onPress={() => {
            let selectList = []
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

  renderItem = ({ index, item }) => {
    if (item.value === 'all') {
      return this.renderItemAllSelect(item)
    }
    let indexInList = this.state.selectList.indexOf(item.key)
    let img =
      indexInList !== -1
        ? getPublicAssets().common.icon_check
        : getPublicAssets().common.icon_uncheck
    return (
      <View style={styles.MenuItemContainerStyle}>
        <TouchableOpacity
          style={styles.ListItemViewStyle}
          onPress={() => {
            let selectList = this.state.selectList.clone()
            if (indexInList === -1) {
              selectList.push(item.key)
            } else {
              selectList.splice(indexInList, 1)
            }
            this.setState({ selectList: selectList })
            this.setTypes(selectList)
          }}
        >
          <Image source={img} style={styles.MenuImageStyle} />
          <Text style={styles.textStyle}>{item.key}</Text>
        </TouchableOpacity>
        {this.state.data.length !== index + 1 && (
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
            {getLanguage(global.language).Find.CONFIRM}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderList = () => {
    let orientation = screen.getOrientation()
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
        <FlatList
          data={this.state.data}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
          extraData={this.state.selectList}
        />
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

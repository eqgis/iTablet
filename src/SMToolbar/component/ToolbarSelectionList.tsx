import React from 'react'
import { FlatList, Image, ImageRequireSource, ListRenderItemInfo, ScaledSize, Text, TouchableOpacity, View } from 'react-native'
import { getImage } from '../../assets'
import { AppStyle, dp } from '../../utils'
import ToolbarSlideCard from './ToolbarSlideCard'

interface SelectionListItem<T> {
  lable: string
  image?: ImageRequireSource
  value: T
}

export interface SelectionListOption<T> {
  data: SelectionListItem<T>[]
  mode: 'single' | 'multiple'
  onSelect: (items: T[]) => void
  onCencel: () => void
  getExtraData?: () => SelectionListItem<T>[] | Promise<SelectionListItem<T>[]>
}

interface Props<T> {
  toolbarVisible: boolean
  option?: SelectionListOption<T>
  windowSize: ScaledSize
}

interface State<T> {
  data: SelectionListItem<T>[]
  selection: T[]
}

class ToolbarSelectionList<T> extends React.Component<Props<T>, State<T>> {
  constructor(props: Props<T>) {
    super(props)

    this.state = {
      data: [],
      selection: []
    }
  }

  isVisible = (): boolean => {
    return this.props.toolbarVisible && this.props.option !== undefined
  }

  componentDidUpdate(prevProps: Props<T>) {
    if(prevProps.toolbarVisible !== this.props.toolbarVisible
      || prevProps.option !== this.props.option
    ) {
      this.updateData()
    }
  }

  updateData = async () => {
    if(!this.props.option) return
    let data: SelectionListItem<T>[] = []
    if(this.props.option?.getExtraData) {
      data = await this.props.option.getExtraData()
    }
    this.setState({
      data: this.props.option.data.concat(data),
      selection: []
    })
  }

  commit = () => {
    this.props.option?.onSelect(this.state.selection)
  }

  onItemPress = (value: T) => {
    if(this.props.option?.mode === 'single') {
      this.props.option?.onSelect([value])
    } else {
      const index = this.state.selection.indexOf(value)
      const newSelection = this.state.selection.concat([])
      if(index > -1) {
        newSelection.splice(index, 1)
      } else {
        newSelection.push(value)
      }
      this.setState({selection: newSelection})
    }
  }


  renderItem = ({item}: ListRenderItemInfo<SelectionListItem<T>>) => {
    const isSelected = this.state.selection.indexOf(item.value) > -1
    const checkIcon = isSelected ? getImage().icon_check : getImage().icon_uncheck
    return (
      <TouchableOpacity
        style={AppStyle.ListItemStyleNS}
        onPress={() => {
          this.onItemPress(item.value)
        }}
      >
        <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
          <View style={{marginRight: dp(2)}}>
            {item.image && <Image
              source={item.image}
              style={AppStyle.Image_Style}
            />}
          </View>
          <Text style={AppStyle.h2} numberOfLines={1}>
            {item.lable}
          </Text>
        </View>

        {this.props.option?.mode === 'multiple' &&
        <Image
          source={checkIcon}
          style={AppStyle.Image_Style}
        />}

      </TouchableOpacity>
    )
  }

  renderList = () => {
    return (
      <FlatList
        data={this.state.data}
        renderItem={this.renderItem}
        keyExtractor={(item, index) => item.lable + '_' + index}
      />
    )
  }

  rendreBottom = () => {
    return (
      <View
        style={[{
          height: dp(60),
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: dp(20)}
        ]}
      >
        <TouchableOpacity
          onPress={this.props.option?.onCencel}
        >
          <Image
            source={getImage().back}
            style={AppStyle.Image_Style}
          />
        </TouchableOpacity>

        {this.props.option?.mode === 'multiple' &&
           <TouchableOpacity
             onPress={this.commit}
           >
             <Image
               source={getImage().icon_submit}
               style={AppStyle.Image_Style}
             />
           </TouchableOpacity>
        }

      </View>
    )
  }


  render() {
    return(
      <ToolbarSlideCard
        visible={this.isVisible()}
        contentContainerStyle={{paddingTop: dp(15)}}
      >
        {this.renderList()}
        {this.rendreBottom()}
      </ToolbarSlideCard>

    )
  }
}

export default ToolbarSelectionList
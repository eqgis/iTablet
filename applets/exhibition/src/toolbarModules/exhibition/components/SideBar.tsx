import { AppStyle } from '@/utils'
import { dp } from 'imobile_for_reactnative/utils/size'
import React from 'react'
import {
  Text,
  Image,
  View,
  TouchableOpacity ,
  ImageSourcePropType
} from 'react-native'

interface Props extends Partial<DefaultProps> {
  sections: Section[]
}

interface DefaultProps {
  showIndicator: boolean
  autoCancel: boolean
}

const defaultProps: DefaultProps = {
  showIndicator: true,
  autoCancel: true
}

interface State {
  currentIndex: string
  clickable: boolean
}

type Section = Item[]

export interface Item {
  image: ImageSourcePropType
  image_selected?: ImageSourcePropType
  title?: string
  /** 是否显示indicator,默认为true */
  showIndicator?: boolean
  /** 选中后再次点击,是否取消选中模式,默认为true */
  autoCancelSelected?: boolean
  action: () => void
}

class SideBar extends React.Component<Props & DefaultProps, State> {

  static defaultProps = defaultProps

  constructor(props: Props & DefaultProps) {
    super(props)

    this.state = {
      currentIndex: '',
      clickable: true
    }
  }

  clear = () => {
    this.setState({
      currentIndex: '',
    })
  }

  renderItem = (item: Item, index: number, sectionIndex: number) => {
    const isSelected = sectionIndex + '_' + index === this.state.currentIndex
    return (
      <TouchableOpacity
        key={index + ''}
        onPress={() => {
          if(this.props.showIndicator) {
            if(this.props.autoCancel) {
              if (item.showIndicator === undefined || item.showIndicator) {
                if (
                  (item.autoCancelSelected === undefined || item.autoCancelSelected) &&
                  this.state.currentIndex === sectionIndex + '_' + index
                ) {
                  this.setState({currentIndex: ''})
                } else {
                  this.setState({currentIndex: sectionIndex + '_' + index})
                }
              }
            } else if(this.state.currentIndex !== sectionIndex + '_' + index) {
              this.setState({currentIndex: sectionIndex + '_' + index})
            }
          }
          item.action()
          this.setState({clickable: false})
          setTimeout(() => {
            this.setState({clickable: true})
          }, 600)
        }}
        disabled={!this.state.clickable}
        style={[
          {
            justifyContent: 'center',
            alignItems: 'center',
            borderRightWidth: dp(2),
            borderRightColor: 'transparent',
            height: dp(50),

          },
          (this.props.showIndicator && isSelected) && {
            backgroundColor: '#F24F02A6'
          }
        ]}
      >
        <Image
          source={/**sSelected ? item.image_selected : */item.image}
          style={{
            width: dp(24),
            height: dp(24)
          }}
        />
        {item.title && (
          <Text style={[AppStyle.h3, {color: 'white'}]}>
            {item.title}
          </Text>
        )}
      </TouchableOpacity>
    )
  }

  renderSection = (section: Section, index: number) => {
    return (
      <View
        key={index + ''}
        style={[
          {
            backgroundColor: '#1E1E1EA6',
            borderRadius: dp(10),
            width: dp(55),
            marginTop: index === 0 ? 0 : dp(10),
            overflow: 'hidden',
          }
        ]}
      >
        {section.map((item, itemIndex) => {
          return this.renderItem(item, itemIndex, index)
        })}
      </View>
    )
  }


  render() {
    return (
      <View>
        {
          this.props.sections.map((section, index) => {
            return this.renderSection(section, index)
          })
        }
      </View>
    )
  }
}

export default SideBar
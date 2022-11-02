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

interface Props {
  sections: Section[]
  showIndicator: boolean
}

interface State {
  currentIndex: string
  clickable: boolean
}

type Section = Item[]

export interface Item {
  image: ImageSourcePropType
  title?: string
  action: () => void
}

class SideBar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      currentIndex: '',
      clickable: true
    }
  }

  renderItem = (item: Item, index: number, sectionIndex: number) => {
    const isSelected = sectionIndex + '_' + index === this.state.currentIndex
    return (
      <TouchableOpacity
        key={index + ''}
        onPress={() => {
          if(this.props.showIndicator) {
            this.setState({currentIndex: sectionIndex + '_' + index})
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
            marginVertical: dp(5),
            borderRightWidth: dp(2),
            borderRightColor: 'transparent',
            height: dp(40),

          },
          (this.props.showIndicator && isSelected) && {
            borderRightColor: '#F24F02'
          }
        ]}
      >
        <Image
          source={item.image}
          style={{
            width: dp(24),
            height: dp(24)
          }}
        />
        {item.title && (
          <Text style={AppStyle.h3}>
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
            backgroundColor: 'white',
            borderTopLeftRadius: dp(10),
            borderBottomLeftRadius: dp(10),
            width: dp(55),
            paddingVertical: dp(5),
            marginTop: dp(20),
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
      <View
        style={{
          position: 'absolute',
          top: dp(10),
          right: 0,
        }}
      >
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
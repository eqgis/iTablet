import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet , Animated,  Easing} from 'react-native'
import { color, size } from '../../../styles'
import { scaleSize } from '../../../utils'
import { getPublicAssets } from '../../../assets'
import { getLanguage } from '../../../language'

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: scaleSize(80),
  },

  loading: {
    position: 'absolute',
    top: scaleSize(20),
    right: scaleSize(20),
    height: scaleSize(44),
    width: scaleSize(44),
  },

  titleView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomWidth: 1,
    height: scaleSize(80),
    borderBottomColor: color.separateColorGray,
  },
  title: {
    fontSize: size.fontSize.fontSizeMd,
    color: color.fontColorBlack,
    backgroundColor: 'transparent',
  },
  imageView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: scaleSize(120),
    height: scaleSize(80),
  },
  image: {
    width: scaleSize(40),
    height: scaleSize(40),
  },
})

export default class AnalystListItem extends Component {
  props: {
    title: string,
    icon: any,
    onPress: () => {},
    style?: Object,
    imgStyle?: Object,
    titleStyle?: Object,
    isAnalyst: Boolean,
  }

  constructor(props) {
    super(props)
    this._rotateValue = new Animated.Value(0)
    this._aniMotion = null
    this.state = {
      is: false,
    }
  }

  componentDidUpdate(prevProps) {
    if(prevProps.isAnalyst!=this.props.isAnalyst){
      if(!this.props.isAnalyst){
        if(this._aniMotion!=null){
          this._aniMotion.stop()
          this._aniMotion = null
        }
      }else{
        if(this._aniMotion==null){
            this._aniMotion = Animated.timing(this._rotateValue,{
              toValue: this._rotateValue._value === 0 ? 1 : 0,
              duration: 800,
              easing: Easing.linear,
              useNativeDriver: true,
            });
            Animated.loop(this._aniMotion).start()
          }
      }
    }
  }

  _onPress = () => {
    if (this.props.onPress && typeof this.props.onPress === 'function') {
      this.props.onPress({ title: this.props.title })
    }
  }

  render() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.itemContainer, this.props.style]}
        onPress={this._onPress}
      >
        {this.props.icon && (
          <View style={styles.imageView}>
            <Image
              resizeMode={'contain'}
              style={[styles.image, this.props.imgStyle]}
              source={this.props.icon}
            />
          </View>
        )}
        <View
          style={[
            styles.titleView,
            !this.props.icon && { marginLeft: scaleSize(30) },
          ]}
        >
          <Text style={[styles.title, this.props.titleStyle]}>
            {this.props.title}
          </Text>
        </View>
          {/* {(this.props.title == getLanguage(language).Analyst_Methods.AGGREGATE_POINTS_ANALYSIS && global.AGGREGATE_POINTS_ANALYSIS) && */}
          {this.props.isAnalyst &&
            <Animated.Image
              resizeMode={'contain'}
              style={[
                styles.loading,
                {
                  transform: [{rotate: this._rotateValue
                    .interpolate({inputRange: [0, 1],outputRange: ['0deg', '360deg']})
                  }]
                }
              ]}
              source={getPublicAssets().common.icon_downloading}
            />
          }
          {/* {(this.props.title == getLanguage(language).Analyst_Methods.DENSITY && global.DENSITY) &&
            <Animated.Image
              resizeMode={'contain'}
              style={[
                styles.loading,
                {
                  transform: [{rotate: this._rotateValue
                    .interpolate({inputRange: [0, 1],outputRange: ['0deg', '360deg']})
                  }]
                }
              ]}
              source={getPublicAssets().common.icon_downloading}
            />
          } */}
      </TouchableOpacity>
    )
  }
}

import React, { Component } from 'react'
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native'
import {color, size} from '../../../../styles'
import {getLanguage} from '../../../../language'
import {scaleSize} from '../../../../utils'
import {getThemeAssets} from '../../../../assets'

// 文件夹组件所需的基础样式
const styles = StyleSheet.create({
    directoryContainer: {
      width: '100%',
      // height: scaleSize(80),
      alignItems: 'flex-start',
      flexDirection: 'column',
      
    },
      titleContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      height: scaleSize(80),
      // backgroundColor: color.bgG2,
      // marginBottom: scaleSize(4),
      borderBottomWidth:scaleSize(1),
      borderBottomColor:'#eee'
    },
    directoryState: {
      width: scaleSize(52),
      height: scaleSize(52),
      marginLeft: 10,
    },
    titleText: {
      fontSize: size.fontSize.fontSizeXl,
      marginLeft: 10,
      color: color.fontColorBlack,
    },
})

// 文件夹对象的类型
interface DictoryObjType{
  type: string,
  index: number,
  name: string,
  path: string,
  children: Array<DictoryObjType>
}
// Section的类型
interface SectionType{
  data: Array<DictoryObjType>,
  dataType: string,
  isShowItem: boolean,
  title: string,

}
// props的类型
interface Props{
  obj: DictoryObjType,
  section: SectionType,
  children?: Component,
}
// state的类型
interface State{
  isDirectoryOpen: boolean,
}
  
/**
 * 文件夹组件
 */
export default class Directory extends Component<Props, State> {
    constructor(props: Props) {
      super(props)
      this.state = {
        isDirectoryOpen : false,  //     默认值为false
      }

      // this.ImgSources = [openDirectoryImg, closeDirectoryImg]
      this.directoryOnpress = this.directoryOnpress.bind(this)
    }
    
    
    /**
     * 改变文件夹的状态的方法
     */
    directoryOnpress(){
      // 报错，
      this.setState({
        isDirectoryOpen : !this.state.isDirectoryOpen,
      })
    }
    render(){
      let display:String = this.props.section.isShowItem ? 'flex' : 'none'
      // 文件夹的层级的关系，改变文件夹的缩进
      let directoryMarginLeft:number = (this.props.obj.index - 1) * scaleSize(52)
      // 当文件夹的状态为打开时（true）显示一个向上的箭头图片，为关闭状态时（false）显示一个向下的箭头
      let arrowImg = this.state.isDirectoryOpen
        ? getThemeAssets().publicAssets.icon_dropup_selected
        : getThemeAssets().publicAssets.icon_dropdown_selected

      return (
        <View style={[styles.directoryContainer, {display, marginLeft: directoryMarginLeft}]}>
        <TouchableOpacity
          style={[styles.titleContainer]}
          onPress={this.directoryOnpress}
          >
          {/* 用于展示此文件夹是否是展开显示状态的图片 */}
          <Image 
            source = {arrowImg}
            style={styles.directoryState}
          />

          {/* 这个文件夹的名字 */}
          <Text style={styles.titleText}>{this.props.obj.name}</Text>
        </TouchableOpacity>

        {/* 当文件夹状态为打开时（true）才渲染其子项 */}
        {this.state.isDirectoryOpen  && this.props.children}
      </View>
        )
    }
  
  
  }

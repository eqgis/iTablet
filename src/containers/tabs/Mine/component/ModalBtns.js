import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { MTBtn, PopView } from '../../../../components'
import { color } from '../../../../styles'
import { scaleSize } from '../../../../utils'
import { getLanguage } from '../../../../language'
import { getThemeAssets } from '../../../../assets'
import { SimpleDialog } from '../../Friend'

export default class ModalBtns extends Component {
  props: {
    actionOfLocal: () => {},
    actionOfOnline: () => {},
    actionOfIPortal: () => {},
    cancel: () => {},
    actionOfWechat: () => {},
    actionOfFriend: () => {},
    showCancel: Boolean,
    style: Object,
    actionOftemplateLocal: () => {}, //分享地图模版 add jiakai
    type: Object,
  }
  constructor(props) {
    super(props)
    this.showCancel =
      this.props.showCancel !== undefined ? this.props.showCancel : true
    this.state = {
      shareMap: true,//分享地图分为地图和模版两种 add jiakai
    }
  }

  setVisible = visible => {
    this.PopView && this.PopView.setVisible(visible)
  }

  render() {
    return (
      <PopView ref={ref => (this.PopView = ref)}>
        {this.state.shareMap && <View style={[styles.bottomBtns, { width: '100%' }, this.props.style]}>
          {this.props.actionOfLocal && (
            <MTBtn
              key={'lcoal'}
              title={getLanguage(GLOBAL.language).Profile.LOCAL}
              style={styles.button}
              image={getThemeAssets().share.local}
              imageStyle={styles.headerBtn}
              onPress={() => {
                if(this.props.type === 'MAP'){
                  this.setState({ shareMap: false })
                }else{
                  this.props.actionOfLocal && this.props.actionOfLocal()
                }    
              }}
            />
          )}
          {this.props.actionOfOnline && (
            <MTBtn
              key={'online'}
              title={'Online'}
              style={styles.button}
              image={getThemeAssets().share.online}
              imageStyle={styles.headerBtn}
              onPress={() => {
                this.props.actionOfOnline && this.props.actionOfOnline()
              }}
            />
          )}
          {this.props.actionOfIPortal && (
            <MTBtn
              key={'iportal'}
              title={'iPortal'}
              style={styles.button}
              image={getThemeAssets().share.iportal}
              imageStyle={styles.headerBtn}
              onPress={() => {
                this.props.actionOfIPortal && this.props.actionOfIPortal()
              }}
            />
          )}
          {this.props.actionOfWechat && (
            <MTBtn
              key={'wechat'}
              title={getLanguage(GLOBAL.language).Prompt.WECHAT}
              style={styles.button}
              image={getThemeAssets().share.wechat}
              imageStyle={styles.headerBtn}
              onPress={() => {
                this.SimpleDialog.set({
                  text: getLanguage(GLOBAL.language).Prompt.OPEN_THRID_PARTY,
                  confirmAction: () => {
                    this.props.actionOfWechat && this.props.actionOfWechat()
                  },
                })
                this.SimpleDialog.setVisible(true)
              }}
            />
          )}
          {this.props.actionOfFriend && (
            <MTBtn
              key={'friend'}
              title={getLanguage(GLOBAL.language).Navigator_Label.FRIENDS}
              style={styles.button}
              image={getThemeAssets().share.friend}
              imageStyle={styles.headerBtn}
              onPress={() => {
                this.props.actionOfFriend && this.props.actionOfFriend()
              }}
            />
          )}
          {!this.props.actionOfOnline && !this.props.actionOfIPortal && (
            <View style={styles.button} />
          )}
          {!this.props.actionOfWechat && <View style={styles.button} />}
          {!this.props.actionOfFriend && <View style={styles.button} />}
          {this.showCancel && (
            <MTBtn
              key={'cancel'}
              title={getLanguage(GLOBAL.language).Prompt.CANCEL}
              style={styles.button}
              image={getThemeAssets().mapTools.icon_tool_cancel}
              imageStyle={styles.headerBtn}
              onPress={() => {
                this.setVisible(false)
                this.props.cancel && this.props.cancel()
              }}
            />
          )}
          {!this.showCancel && <View style={styles.button} />}
          <SimpleDialog ref={ref => (this.SimpleDialog = ref)} />
        </View>}


        {!this.state.shareMap && <View style={[styles.bottomBtns, { width: '100%' }, this.props.style]}>
          {
            <MTBtn
              key={'lcoal'}
              title={getLanguage(GLOBAL.language).Profile.MAP}
              style={styles.button}
              image={getThemeAssets().mine.my_map}
              imageStyle={styles.headerBtn}
              onPress={() => {
                this.setState({ shareMap: true })
                this.props.actionOfLocal && this.props.actionOfLocal()
              }}
            />
          }
          {
            <MTBtn
              key={'wechat'}
              title={getLanguage(GLOBAL.language).Profile.TEMPLATE}
              style={styles.button}
              image={getThemeAssets().mine.icon_my_template}
              imageStyle={styles.headerBtn}
              onPress={() => {
                this.setState({ shareMap: true })
                this.props.actionOftemplateLocal && this.props.actionOftemplateLocal()
              }}
            />
          }
          {<View style={styles.button} />}
          {<View style={styles.button} />}
          {
            <MTBtn
              key={'cancel'}
              title={getLanguage(GLOBAL.language).Prompt.CANCEL}
              style={styles.button}
              image={getThemeAssets().mapTools.icon_tool_cancel}
              imageStyle={styles.headerBtn}
              onPress={() => {
                this.setState({ shareMap: true })
                this.setVisible(false)
                this.props.cancel && this.props.cancel()
              }}
            />
          }
        </View>}
      </PopView>
    )
  }
}
const styles = StyleSheet.create({
  bottomBtns: {
    borderTopWidth: 1,
    borderColor: color.contentColorGray,
    flexDirection: 'row',
    height: scaleSize(100),
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: color.contentColorWhite,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBtn: {
    height: scaleSize(60),
    width: scaleSize(60),
  },
})

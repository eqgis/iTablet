import { SARVideoView } from 'imobile_for_reactnative'
import { ImagePicker } from '../../components'
import { Toast } from '../../utils'
import { getLanguage } from '../../language'

function getPage(page, bottomBar = undefined) {
  let data = []
  let pageAction = () => {}
  switch (page) {
    case 'main':
      data = [
        {
          key: 'add',
          title: getLanguage(global.language).Analyst_Labels.ADD,
          image: require('../../assets/mapTools/icon_add_white.png'),
        },
        {
          key: 'modify',
          title: getLanguage(global.language).Analyst_Labels.Edit,
          image: require('../../assets/mapTools/edit_white.png'),
        },
        {
          key: 'delete',
          title: getLanguage(global.language).Analyst_Labels.DELETE,
          image: require('../../assets/mapTools/icon_delete_white.png'),
          action: () => {
            Toast.show(
              global.language === 'CN'
                ? '请点击需要删除的视频'
                : 'Tap the video to delete',
            )
            SARVideoView.setTapAction('DELETE')
          },
        },
      ]
      pageAction = () => {
        SARVideoView.setTapAction('NONE')
        SARVideoView.setPlaneVisible(false)
      }
      break
    case 'add':
      data = [
        {
          key: 'main',
          title: getLanguage(global.language).Find.BACK,
          image: require('../../assets/public/Frenchgrey/icon-back-white.png'),
        },
        {
          key: 'addAtCurrent',
          title: getLanguage(global.language).Map_Main_Menu
            .MAP_AR_TO_CURRENT_POSITION,
          image: require('../../assets/mapTools/collect_point_normal.png'),
          action: onAddVideo,
        },
        {
          key: 'addAtPlane',
          title: getLanguage(global.language).Map_Main_Menu
            .MAP_AR_SELECT_POINT_PLANE,
          image: require('../../assets/mapEdit/icon_action3d.png'),
          action: () => onAddVideoAtPlane(bottomBar),
        },
      ]
      pageAction = () => {
        SARVideoView.setTapAction('NONE')
        SARVideoView.setPlaneVisible(false)
      }
      break
    case 'addAtPlane':
      data = [
        {
          key: 'add',
          title: getLanguage(global.language).Find.BACK,
          image: require('../../assets/public/Frenchgrey/icon-back-white.png'),
        },
      ]
      break
    case 'modify':
      data = [
        {
          key: 'main',
          title: getLanguage(global.language).Find.BACK,
          image: require('../../assets/public/Frenchgrey/icon-back-white.png'),
        },
      ]
      pageAction = () => {
        Toast.show(
          global.language === 'CN'
            ? '请点击需要修改的视频'
            : 'Tap the video to modify',
        )
        SARVideoView.setTapAction('SELECT')
        SARVideoView.setOnVideoTapListener(() => {
          if (bottomBar) {
            bottomBar.goto('modify_selected')
          }
        })
        SARVideoView.setPlaneVisible(false)
      }
      break
    case 'modify_selected':
      data = [
        {
          key: 'modify',
          title: getLanguage(global.language).Find.BACK,
          image: require('../../assets/public/Frenchgrey/icon-back-white.png'),
        },
        {
          key: 'modifyToCurrent',
          title: getLanguage(global.language).Map_Main_Menu
            .MAP_AR_TO_CURRENT_POSITION,
          image: require('../../assets/mapTools/collect_point_normal.png'),
          action: () => {
            SARVideoView.modifyVideoToCurrentPosition()
            if (bottomBar) {
              bottomBar.goto('modify')
            }
          },
        },
        {
          key: 'modifyToPlane',
          title: getLanguage(global.language).Map_Main_Menu
            .MAP_AR_SELECT_POINT_PLANE,
          image: require('../../assets/mapEdit/icon_action3d.png'),
        },
      ]
      pageAction = () => {
        SARVideoView.setTapAction('NONE')
        SARVideoView.setPlaneVisible(false)
      }
      break
    case 'modifyToPlane':
      data = [
        {
          key: 'modify_selected',
          title: getLanguage(global.language).Find.BACK,
          image: require('../../assets/public/Frenchgrey/icon-back-white.png'),
        },
      ]
      pageAction = () => {
        Toast.show(
          global.language === 'CN'
            ? '请点击需平面修改视频位置'
            : 'Tap the plane to modify location',
        )
        SARVideoView.setTapAction('MODIFY')
        SARVideoView.setPlaneVisible(true)
        SARVideoView.setOnVideoModifyListener(() => {
          if (bottomBar) {
            bottomBar.goto('modify')
          }
        })
      }
      break
  }

  return { data, pageAction }
}

function onAddVideo() {
  ImagePicker.AlbumListView.defaultProps.showDialog = false
  ImagePicker.AlbumListView.defaultProps.assetType = 'Videos'
  ImagePicker.AlbumListView.defaultProps.groupTypes = 'All'
  ImagePicker.getAlbum({
    maxSize: 1,
    callback: async data => {
      if (data && data.length > 0) {
        let path = data[0].uri
        SARVideoView.addVideoAtCurrentPosition(path)
      }
    },
  })
}

function onAddVideoAtPlane(bottomBar) {
  ImagePicker.AlbumListView.defaultProps.showDialog = false
  ImagePicker.AlbumListView.defaultProps.assetType = 'Videos'
  ImagePicker.AlbumListView.defaultProps.groupTypes = 'All'
  ImagePicker.getAlbum({
    maxSize: 1,
    callback: async data => {
      if (data && data.length > 0) {
        let path = data[0].uri
        Toast.show(
          global.language === 'CN'
            ? '请点击平面添加视频'
            : 'Tap the plane to add video',
        )
        SARVideoView.setTapAction('ADD')
        SARVideoView.setVideoPath(path)
        SARVideoView.setPlaneVisible(true)
        SARVideoView.setOnVideoAddListener(() => {
          bottomBar.goto('add')
        })
      } else if (bottomBar) {
        bottomBar.goto('add')
      }
    },
  })
}

export default {
  getPage,
}

import { SARImage } from 'imobile_for_reactnative'
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
          key: 'selectToAdd',
          title: getLanguage(global.language).Analyst_Labels.ADD,
          image: require('../../assets/mapTools/icon_add_white.png'),
          action: () => selectImage(bottomBar),
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
                ? '请点击需要删除的图片'
                : 'Tap the image to delete',
            )
            SARImage.setTapAction('DELETE')
          },
        },
      ]
      pageAction = () => {
        SARImage.setTapAction('NONE')
        SARImage.setPlaneVisible(false)
      }
      break
    case 'add':
      data = [
        {
          key: 'main',
          image: require('../../assets/public/Frenchgrey/icon-back-white.png'),
        },
        {
          key: 'addAtCurrent',
          title: getLanguage(global.language).Map_Main_Menu
            .MAP_AR_ADD_TO_CURRENT_POSITION,
          image: require('../../assets/mapTools/collect_point_normal.png'),
          action: () => addImage(bottomBar),
        },
        {
          key: 'addAtPlane',
          title: getLanguage(global.language).Map_Main_Menu.MAP_AR_ADD_TO_PLANE,
          image: require('../../assets/mapEdit/icon_action3d.png'),
          action: () => addImageToPlane(bottomBar),
        },
      ]
      pageAction = () => {
        SARImage.setTapAction('NONE')
        SARImage.setPlaneVisible(false)
      }
      break
    case 'addAtPlane':
      data = [
        {
          key: 'add',
          image: require('../../assets/public/Frenchgrey/icon-back-white.png'),
        },
      ]
      break
    case 'modify':
      data = [
        {
          key: 'main',
          image: require('../../assets/public/Frenchgrey/icon-back-white.png'),
        },
      ]
      pageAction = () => {
        Toast.show(
          global.language === 'CN'
            ? '请点击需要修改的图片'
            : 'Tap the image to modify',
        )
        SARImage.setTapAction('SELECT')
        SARImage.setOnImageTapListener(() => {
          if (bottomBar) {
            bottomBar.goto('modify_selected')
          }
        })
        SARImage.setPlaneVisible(false)
      }
      break
    case 'modify_selected':
      data = [
        {
          key: 'modify',
          image: require('../../assets/public/Frenchgrey/icon-back-white.png'),
        },
        {
          key: 'modifyToCurrent',
          title: getLanguage(global.language).Map_Main_Menu
            .MAP_AR_MOVE_TO_CURRENT_POSITION,
          image: require('../../assets/mapTools/collect_point_normal.png'),
          action: () => {
            SARImage.modifyImageToCurrentPosition()
            if (bottomBar) {
              bottomBar.goto('main')
            }
          },
        },
        {
          key: 'modifyToPlane',
          title: getLanguage(global.language).Map_Main_Menu
            .MAP_AR_MOVE_TO_PLANE,
          image: require('../../assets/mapEdit/icon_action3d.png'),
        },
      ]
      pageAction = () => {
        SARImage.setTapAction('NONE')
        SARImage.setPlaneVisible(false)
      }
      break
    case 'modifyToPlane':
      data = [
        {
          key: 'modify_selected',
          image: require('../../assets/public/Frenchgrey/icon-back-white.png'),
        },
      ]
      pageAction = () => {
        Toast.show(
          global.language === 'CN'
            ? '请点击需平面修改位置'
            : 'Tap the plane to modify location',
        )
        SARImage.setTapAction('MODIFY')
        SARImage.setPlaneVisible(true)
        SARImage.setOnImageModifyListener(() => {
          if (bottomBar) {
            bottomBar.goto('main')
          }
        })
      }
      break
  }

  return { data, pageAction }
}

function selectImage(bottomBar) {
  ImagePicker.AlbumListView.defaultProps.showDialog = false
  ImagePicker.AlbumListView.defaultProps.assetType = 'Photos'
  ImagePicker.AlbumListView.defaultProps.groupTypes = 'All'
  ImagePicker.getAlbum({
    maxSize: 1,
    callback: async data => {
      if (data && data.length > 0) {
        let path = data[0].uri
        bottomBar.addData({ path: path })
        bottomBar.goto('add')
      }
    },
  })
}

function addImage(bottomBar) {
  let { path } = bottomBar.getData()
  SARImage.addImageAtCurrentPosition(path)
  bottomBar.goto('main')
}

function addImageToPlane(bottomBar) {
  let { path } = bottomBar.getData()
  SARImage.setTapAction('ADD')
  SARImage.setImagePath(path)
  SARImage.setPlaneVisible(true)
  SARImage.setOnImageAddListener(() => {
    bottomBar.goto('main')
  })
}

export default {
  getPage,
}

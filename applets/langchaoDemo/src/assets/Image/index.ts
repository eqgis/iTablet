const flight = require('./icon_flightpath.png')
const telephone1 = require('./telephone1.png')
const telephone2 = require('./telephone2.png')
const icon_upload = require('./icon_upload.png')
const icon_upload_gray = require('./icon_upload_gray.png')
const icon_ditu_1 = require('./ditu_1.png')
const icon_ditu_2 = require('./ditu_2.png')
const icon_ditu_3 = require('./ditu_3.png')
const icon_ditu_4 = require('./ditu_4.png')
const icon_ditu_5 = require('./ditu_5.png')
const exitApp = require('./icon_exit.png')

const icon_base_setting = require('./icon_base_setting.png')
const icon_contact_setting = require('./icon_contact_setting.png')
const icon_language_setting = require('./icon_language_setting.png')
const icon_license_setting = require('./icon_license_setting.png')
const icon_server_setting = require('./icon_server_setting.png')
const icon_userInfo_setting = require('./icon_userInfo_setting.png')

const icon_map_image = require('./icon_map_image.png')
const icon_map_normal = require('./icon_map_normal.png')
const icon_map_terrain = require('./icon_map_terrain.png')
const icon_map_image_select = require('./icon_map_image_select.png')
const icon_map_normal_select = require('./icon_map_normal_select.png')
const icon_map_terrain_select = require('./icon_map_terrain_select.png')

const image = {
  flight,
  telephone1,
  telephone2,
  icon_upload,
  icon_upload_gray,
  icon_ditu_1,
  icon_ditu_2,
  icon_ditu_3,
  icon_ditu_4,
  icon_ditu_5,
  exitApp,
  icon_base_setting,
  icon_contact_setting,
  icon_language_setting,
  icon_license_setting,
  icon_server_setting,
  icon_userInfo_setting,
  icon_map_image,
  icon_map_normal,
  icon_map_terrain,
  icon_map_image_select,
  icon_map_normal_select,
  icon_map_terrain_select,
}

function getImage(): typeof image {
  return image
}

export {
  getImage
}
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
}

function getImage(): typeof image {
  return image
}

export {
  getImage
}
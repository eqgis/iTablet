const flight = require('./icon_flightpath.png')
const telephone1 = require('./telephone1.png')
const telephone2 = require('./telephone2.png')
const icon_upload = require('./icon_upload.png')

const image = {
  flight,
  telephone1,
  telephone2,
  icon_upload,
}

function getImage(): typeof image {
  return image
}

export {
  getImage
}
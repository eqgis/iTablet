const flight = require('./icon_flightpath.png')
const telephone1 = require('./telephone1.png')
const telephone2 = require('./telephone2.png')

const image = {
  flight,
  telephone1,
  telephone2,
}

function getImage(): typeof image {
  return image
}

export {
  getImage
}
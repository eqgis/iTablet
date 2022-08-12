const flight = require('./icon_flightpath.png')

const image = {
  flight,
}

function getImage(): typeof image {
  return image
}

export {
  getImage
}
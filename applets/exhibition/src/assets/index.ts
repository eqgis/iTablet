const scan = require('./icon_scan.png')
const scan_circle = require('./scan_circle.png')
const scan_line = require('./scan_line.png')
const scan_net = require('./scan_net.png')
const ar_scan = require('./img-icon-ar_scan.png')
const ar_przt = require('./img-icon-ar_presentation.png')
const ar_infra = require('./img-icon-ar_infrastructure.png')
const background_red = require('./background_red.png')
const background_transparent = require('./background_transparent.png')

const image = {
  scan,
  scan_circle,
  scan_line,
  scan_net,
  ar_scan,
  ar_przt,
  ar_infra,
  background_red,
  background_transparent,
}

function getImage(): typeof image {
  return image
}

export {
  getImage
}
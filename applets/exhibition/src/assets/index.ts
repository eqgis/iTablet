const scan = require('./icon_scan.png')
const scan_circle = require('./scan_circle.png')
const scan_line = require('./scan_line.png')
const scan_net = require('./scan_net.png')
const ar_scan = require('./img-icon-ar_scan.png')
const ar_przt = require('./img-icon-ar_presentation.png')
const ar_infra = require('./img-icon-ar_infrastructure.png')
const background_red = require('./background_red.png')
const background_transparent = require('./background_transparent.png')
const scan_circle_red = require('./scan_circle_red.png')
const scan_line_red = require('./scan_line_red.png')
const scan_net_red = require('./scan_inner_red.png')

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
  scan_circle_red,
  scan_line_red,
  scan_net_red,
}

function getImage(): typeof image {
  return image
}

export {
  getImage
}
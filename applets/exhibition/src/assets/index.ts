const scan = require('./icon_scan.png')
const scan_circle = require('./scan_circle.png')
const scan_line = require('./scan_line.png')
const scan_net = require('./scan_net.png')

const image = {
  scan,
  scan_circle,
  scan_line,
  scan_net,
}

function getImage(): typeof image {
  return image
}

export {
  getImage
}
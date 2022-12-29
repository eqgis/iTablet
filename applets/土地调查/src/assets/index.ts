const flight = require('./icon_flightpath.png')
const check = require('./icon_check.png')
const save = require('./icon_save.png')
const upload = require('./icon_upload.png')
const task = require('./icon_task.png')
const add = require('./icon_add.png')
const edit = require('./icon_edit.png')
const layer = require('./icon_layer.png')
const location = require('./icon_location.png')

const image = {
  flight,
  check,
  save,
  upload,
  task,
  add,
  edit,
  layer,
  location,
}

function getImage(): typeof image {
  return image
}

export {
  getImage
}